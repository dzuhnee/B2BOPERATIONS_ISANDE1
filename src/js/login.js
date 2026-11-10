import { auth } from "./firebase.js";
import {
  signInWithEmailAndPassword,
  signOut
} from "https://www.gstatic.com/firebasejs/10.12.0/firebase-auth.js";

// Role/page lookup only. Firebase does the actual security check.
const USERS = {
  "sophia.ramirez@5joys.com": { name: "Sophia Ramirez", role: "Business Development", page: "business-development.html" },
  "carlos.reyes@5joys.com": { name: "Carlos Reyes", role: "Operations Head", page: "operations-head.html" },
  "angela.santos@5joys.com": { name: "Angela Santos", role: "HR Specialist", page: "hr-specialist.html" },
  "michael.dela.cruz@5joys.com": { name: "Michael Dela Cruz", role: "Store Trainer", page: "store-trainer.html" },
  "ruth.reyes@5joys.com": { name: "Ruth Reyes", role: "Store Manager", page: "store-manager.html" },
  "joel.navarro@5joys.com": { name: "Joel Navarro", role: "Supply Chain Officer", page: "supply-chain.html" },
  "bea.hernandez@5joys.com": { name: "Bea Hernandez", role: "Area Manager", page: "area-manager.html" },
  "ruth.torres@5joys.com": { name: "Ruth Torres", role: "Store Manager", page: "store-manager.html" },
  "engr.nina.cruz@5joys.com": { name: "Engr. Nina Cruz", role: "Engineering Head", page: "engineering-head.html" },
  "maria.santos@5joys.com": { name: "Maria Santos", role: "Executive Management", page: "executive-management.html" },
  "carlo.lim@5joys.com": { name: "Carlo Lim", role: "Finance Head", page: "finance-head.html" },
  "atty.maya.santos@5joys.com": { name: "Atty. Maya Santos", role: "Legal Head", page: "legal-head.html" }
};

const DEPARTMENTS = {
  "Operations Head": "Operations",
  "Legal Head": "Legal",
  "Finance Head": "Finance",
  "Engineering Head": "Engineering"
};

const form = document.getElementById("loginForm");
const message = document.getElementById("loginMessage");
const button = form.querySelector("button[type=submit]");

form.addEventListener("submit", async (event) => {
  event.preventDefault();
  message.textContent = "";
  message.style.color = "#7B1D1D";

  const email = document.getElementById("email").value.trim().toLowerCase();
  const password = document.getElementById("password").value;

  button.disabled = true;
  try {
    await signInWithEmailAndPassword(auth, email, password);

    const user = USERS[email];
    if (!user) {
      await signOut(auth);
      message.textContent = "No dashboard is assigned to this account.";
      return;
    }

    // New-style key
    localStorage.setItem("loggedInUser", JSON.stringify({ email, name: user.name, role: user.role }));
    // Old-style keys, in case your dashboards still read these
    localStorage.setItem("b2bUserRole", user.role);
    localStorage.setItem("b2bUserName", user.name);
    if (DEPARTMENTS[user.role]) {
      localStorage.setItem("b2bDepartment", DEPARTMENTS[user.role]);
    }

    window.location.href = user.page;
  } catch (error) {
    console.error(error);
    message.textContent = "Invalid email or password.";
  } finally {
    button.disabled = false;
  }
});