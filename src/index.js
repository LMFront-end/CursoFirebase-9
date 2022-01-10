import { initializeApp } from 'firebase/app';
import {
    getFirestore,
    collection,
    /* getDocs */
    onSnapshot,
    addDoc,
    deleteDoc,
    doc,
    query,
    where,
    orderBy,
    serverTimestamp,
    getDoc,
    updateDoc

} from 'firebase/firestore';
import {
    getAuth,
    createUserWithEmailAndPassword,
    signOut,
    signInWithEmailAndPassword,
    onAuthStateChanged
} from 'firebase/auth';

const firebaseConfig = {
    apiKey: "AIzaSyBRgML5uqU64jiFKLi2d3-trt3rLGaYwG8",
    authDomain: "fir-9-dojo-9cb68.firebaseapp.com",
    projectId: "fir-9-dojo-9cb68",
    storageBucket: "fir-9-dojo-9cb68.appspot.com",
    messagingSenderId: "593073132361",
    appId: "1:593073132361:web:80ec0f8b49efa0fcdd4098"
};

// init firebase app
initializeApp(firebaseConfig);

//init services
const db = getFirestore();
const auth = getAuth();

// version 8 
/* 
const db = firebase.firestore()
db.collection('books') */

// collection ref
const colRef = collection(db, 'books');

//query

/* const q = query(colRef, where("author", "==", "Lina"), orderBy("title", "desc")); */

const q = query(colRef, orderBy("createAt"));


//get collection data

/* getDocs(colRef)
    .then((snapshot) => {

        // docs ---> all documents
        //console.log(snapshot.docs)
        let books = [];
        snapshot.docs.forEach((doc) => {
            books.push({...doc.data(), id: doc.id })
        });

        console.log(books);
    })
    .catch(err => console.error(err.message)); */


// real time collection data
const unsubCol = onSnapshot(q, (snapshot) => {
    let books = [];
    snapshot.docs.forEach((doc) => {
        books.push({...doc.data(), id: doc.id })
    });

    console.log(books);
})

// adding documents

const addBookForm = document.querySelector('.add');

addBookForm.addEventListener('submit', (e) => {
    e.preventDefault();

    addDoc(colRef, {
            title: addBookForm.title.value,
            author: addBookForm.author.value,
            createAt: serverTimestamp()
        })
        .then(() => {
            addBookForm.reset();
        })
})

//deleting documents
const deleteBookForm = document.querySelector('.delete');

deleteBookForm.addEventListener('submit', (e) => {
    e.preventDefault();

    const docRef = doc(db, 'books', deleteBookForm.id.value);

    deleteDoc(docRef)
        .then(() => {
            deleteBookForm.reset();
        })
})

// get a single document

const docRef = doc(db, 'books', 'gYEMmMSYnfh2tcu4vbUM')

/* getDoc(docRef)
    .then((doc) => {
        console.log(doc.data(), doc.id)
    }); */

const unsubDoc = onSnapshot(docRef, (doc) => {
    console.log(doc.data(), doc.id)
})


//updating a document
const d = document;
const updateForm = d.querySelector('.update');

updateForm.addEventListener('submit', (e) => {
    e.preventDefault();

    const docRef = doc(db, 'books', updateForm.id.value);

    updateDoc(docRef, {
            title: 'update title',
        })
        .then(() => {
            updateForm.reset();
        })
});

// signing user up

const signupForm = d.querySelector('.signup');

signupForm.addEventListener('submit', (e) => {
    e.preventDefault();

    const email = signupForm.email.value;
    const password = signupForm.password.value;

    createUserWithEmailAndPassword(auth, email, password)
        .then((cred) => {
            console.log('user created', cred.user)
            signupForm.reset();
        })
        .catch((err) => {
            console.log(err.message)
        })

})

// logging in and out

const logoutButton = d.querySelector('.logout');

logoutButton.addEventListener('click', () => {

    signOut(auth)
        .then(() => {
            //console.log('the user signed out')
        })
        .catch((err) => {
            console.log(err.message)
        })

});

const loginForm = d.querySelector('.login');

loginForm.addEventListener('submit', (e) => {
    e.preventDefault();

    const email = loginForm.email.value;
    const password = loginForm.password.value;

    signInWithEmailAndPassword(auth, email, password)
        .then((cred) => {
            //console.log('user logged in: ', cred.user)
        })
        .catch((err) => {
            console.log(err.message)
        })
})

// subcribing to auth changes

const unsubAuth = onAuthStateChanged(auth, (user) => {

    console.log('user state changed: ', user)
})

// unsubscribing from changes (auth & db)

const unsubButton = d.querySelector('.unsub');

unsubButton.addEventListener('click', () => {

    console.log('unsubscribing');

    unsubCol();
    unsubDoc();
    unsubAuth();
})