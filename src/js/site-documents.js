/* ==========================================================
   BEE-TO-BEE OPERATIONS
   SITE PROPOSAL DOCUMENTS — FIRESTORE FILE STORE

   Firebase Storage is not enabled for this project (it needs the Blaze
   plan), so uploaded files are stored in Firestore:

   - siteDocuments/{documentId}               metadata (applicationId, name,
                                               type, size, category, uploader)
   - siteDocuments/{documentId}/chunks/{n}    base64 pieces of the file,
                                               each well under the 1 MB
                                               document limit

   Business Development uploads land titles with a new site proposal; the
   Legal, Finance, Engineering, and Operations dashboards list and open them.
   Exposed as window.siteDocuments for the non-module dashboard scripts.
========================================================== */

import { auth, db } from "./firebase.js";
import {
    collection,
    doc,
    getDocs,
    query,
    serverTimestamp,
    setDoc,
    where
} from "https://www.gstatic.com/firebasejs/10.12.0/firebase-firestore.js";

const DOCUMENTS = "siteDocuments";
const CHUNK_CHARS = 700000; // multiple of 4, so every chunk is valid base64 on its own
export const MAX_FILE_BYTES = 10 * 1024 * 1024;
export const MAX_FILES = 5;
export const ALLOWED_TYPES = ["application/pdf", "image/jpeg", "image/png"];

function readAsBase64(file){
    return new Promise((resolve, reject)=>{
        const reader = new FileReader();
        reader.onload = ()=>resolve(String(reader.result).split(",")[1] || "");
        reader.onerror = ()=>reject(new Error(`Could not read ${file.name}.`));
        reader.readAsDataURL(file);
    });
}

/** Throws an Error with a user-facing message when the selection is not acceptable. */
export function validateFiles(files){
    if(!files.length) throw new Error("Attach at least one land title document.");
    if(files.length > MAX_FILES) throw new Error(`Attach at most ${MAX_FILES} documents.`);
    files.forEach(file=>{
        if(!ALLOWED_TYPES.includes(file.type)) throw new Error(`${file.name} is not a PDF, JPG, or PNG file.`);
        if(file.size > MAX_FILE_BYTES) throw new Error(`${file.name} is larger than 10 MB.`);
        if(!file.size) throw new Error(`${file.name} is empty.`);
    });
}

/**
 * Uploads files for an application. `onProgress(done, total)` reports chunks
 * written. Resolves with the saved document metadata.
 */
export async function uploadSiteDocuments(applicationId, files, { category = "Land Title", uploaderName = "", onProgress } = {}){
    if(!auth.currentUser) throw new Error("Your session expired. Sign in again to upload documents.");
    validateFiles(files);

    const encoded = await Promise.all(files.map(readAsBase64));
    const total = encoded.reduce((sum, data)=>sum + Math.max(1, Math.ceil(data.length / CHUNK_CHARS)), 0);
    let done = 0;
    const saved = [];

    for(const [index, file] of files.entries()){
        const data = encoded[index];
        const ref = doc(collection(db, DOCUMENTS));
        const chunkCount = Math.max(1, Math.ceil(data.length / CHUNK_CHARS));

        // Chunks first, metadata last: a listed document is always complete.
        for(let chunk = 0; chunk < chunkCount; chunk += 1){
            await setDoc(doc(db, DOCUMENTS, ref.id, "chunks", String(chunk)), {
                data:data.slice(chunk * CHUNK_CHARS, (chunk + 1) * CHUNK_CHARS)
            });
            done += 1;
            onProgress?.(done, total);
        }

        const metadata = {
            applicationId,
            name:file.name,
            type:file.type,
            size:file.size,
            category,
            chunkCount,
            uploadedAt:serverTimestamp(),
            uploadedBy:auth.currentUser.email,
            uploadedByName:uploaderName || auth.currentUser.email
        };
        await setDoc(ref, metadata);
        saved.push({ id:ref.id, ...metadata });
    }
    return saved;
}

/** Lists uploaded documents for an application, oldest first. */
export async function listSiteDocuments(applicationId){
    const snapshot = await getDocs(query(collection(db, DOCUMENTS), where("applicationId", "==", applicationId)));
    return snapshot.docs
        .map(item=>({ id:item.id, ...item.data({ serverTimestamps:"estimate" }) }))
        .sort((left, right)=>(left.uploadedAt?.toMillis?.() ?? 0) - (right.uploadedAt?.toMillis?.() ?? 0));
}

async function loadBlob(documentMeta){
    const snapshot = await getDocs(collection(db, DOCUMENTS, documentMeta.id, "chunks"));
    const chunks = snapshot.docs
        .sort((left, right)=>Number(left.id) - Number(right.id))
        .map(item=>item.data().data || "");
    if(chunks.length !== documentMeta.chunkCount) throw new Error(`${documentMeta.name} is incomplete and cannot be opened.`);

    const parts = chunks.map(chunk=>{
        const binary = atob(chunk);
        const bytes = new Uint8Array(binary.length);
        for(let index = 0; index < binary.length; index += 1) bytes[index] = binary.charCodeAt(index);
        return bytes;
    });
    return new Blob(parts, { type:documentMeta.type || "application/octet-stream" });
}

/**
 * Opens a document in a new tab. Call directly from a click handler: the tab
 * is opened immediately (so popup blockers allow it) and filled once loaded.
 */
export async function openSiteDocument(documentMeta){
    const tab = window.open("", "_blank");
    if(tab) tab.document.title = `Loading ${documentMeta.name}…`;
    try{
        const url = URL.createObjectURL(await loadBlob(documentMeta));
        if(tab){
            tab.location.href = url;
        }else{
            // Popup blocked: fall back to a download.
            const link = Object.assign(document.createElement("a"), { href:url, download:documentMeta.name });
            link.click();
        }
        setTimeout(()=>URL.revokeObjectURL(url), 60000);
    }catch(error){
        tab?.close();
        throw error;
    }
}

window.siteDocuments = {
    MAX_FILE_BYTES,
    MAX_FILES,
    validateFiles,
    uploadSiteDocuments,
    listSiteDocuments,
    openSiteDocument
};
window.dispatchEvent(new Event("site-documents-ready"));
