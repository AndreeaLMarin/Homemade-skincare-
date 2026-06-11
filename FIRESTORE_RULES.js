

rules_version = '2';
service cloud.firestore {
  match /databases/{database}/documents {

    match /users/{userId} {
      allow read:   if request.auth != null && (request.auth.uid == userId || isAdmin());
      allow create: if request.auth != null && request.auth.uid == userId;
      allow update: if request.auth != null && (request.auth.uid == userId || isAdmin());
    }

    match /products/{id} {
      allow read:  if true;
      allow write: if request.auth != null && isAdmin();
    }

    match /recipes/{id} {
      allow read:  if true;
      allow write: if request.auth != null && isAdmin();
    }

    match /tutorials/{id} {
      allow read:  if true;
      allow write: if request.auth != null && isAdmin();
    }

    match /storysections/{id} {
      allow read:  if true;
      allow write: if request.auth != null && isAdmin();
    }

    match /orders/{orderId} {
      allow create: if request.auth != null;
      allow read:   if request.auth != null &&
        (resource.data.userId == request.auth.uid || isAdmin());
      allow update: if request.auth != null && isAdmin();
      allow delete: if request.auth != null && isAdmin();
    }

    // NOTIFICATIONS — users read/update only their own
    match /notifications/{notifId} {
      allow read:   if request.auth != null && resource.data.userId == request.auth.uid;
      allow create: if request.auth != null;
      allow update: if request.auth != null && resource.data.userId == request.auth.uid;
    }

    function isAdmin() {
      return get(/databases/$(database)/documents/users/$(request.auth.uid)).data.role == 'admin';
    }
  }
}
