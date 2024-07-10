// pages/index.js
"use client";

import styles from "./page.module.css";
import { useState, useEffect, useCallback } from "react";
import { ref, onValue } from "firebase/database";
import { database } from "./firebaseConfig";
import toast, { Toaster } from "react-hot-toast";
import TicketForm from "./components/TicketForm";
import TicketList from "./components/TicketList";
import FilterButtons from "./components/FilterButtons";

export default function Home() {
  const [tickets, setTickets] = useState([]);
  const [filteredTickets, setFilteredTickets] = useState([]);
  const [selectedFilter, setSelectedFilter] = useState("All");

  const fetchTickets = useCallback(() => {
    const userEmails = JSON.parse(localStorage.getItem("userEmails")) || [];

    const dbRef = ref(database, "tickets");

    onValue(
      dbRef,
      (snapshot) => {
        const data = snapshot.val();
        if (data) {
          const userTickets = Object.keys(data)
            .filter((key) => userEmails.includes(data[key].email))
            .map((key) => ({ id: key, ...data[key] }));
          setTickets(userTickets);
          setFilteredTickets(userTickets); // Initially show all user tickets
        } else {
          setTickets([]);
          setFilteredTickets([]);
        }
      },
      (error) => {
        console.error("Error fetching tickets: ", error);
        toast.error("Error fetching tickets!");
      }
    );
  }, []);

  useEffect(() => {
    fetchTickets();
  }, [fetchTickets]);

  useEffect(() => {
    const userEmails = JSON.parse(localStorage.getItem("userEmails")) || [];

    // Check if userEmails is empty and toast has not been shown
    if (userEmails.length === 0 && !localStorage.getItem("welcomeToastShown")) {
      toast.success(
        "Welcome to the Help Desk! Please submit a ticket to get started."
      );

      // Set a flag in localStorage to indicate the toast has been shown
      localStorage.setItem("welcomeToastShown", "true");
    }
  }, []);

  useEffect(() => {
    if (selectedFilter === "All") {
      setFilteredTickets(tickets);
    } else {
      setFilteredTickets(
        tickets.filter((ticket) => ticket.status === selectedFilter)
      );
    }
  }, [selectedFilter, tickets]);

  return (
    <main className={styles.main}>
      <Toaster />
      <h1 className={styles.heading}>Help Desk</h1>
      <TicketForm onSubmit={fetchTickets} />
      {/* <FilterButtons
        selectedFilter={selectedFilter}
        setSelectedFilter={setSelectedFilter}
      /> */}
      <TicketList tickets={filteredTickets} />
    </main>
  );
}

// //trying an array of emails
// // pages/index.js
// "use client";

// import styles from "./page.module.css";
// import { useState, useEffect } from "react";
// import { ref, onValue } from "firebase/database";
// import { database } from "./firebaseConfig";
// import toast, { Toaster } from "react-hot-toast";
// import TicketForm from "./components/TicketForm";
// import TicketList from "./components/TicketList";
// import FilterButtons from "./components/FilterButtons";

// export default function Home() {
//   const [tickets, setTickets] = useState([]);
//   const [filteredTickets, setFilteredTickets] = useState([]);
//   const [selectedFilter, setSelectedFilter] = useState("All");

//   useEffect(() => {
//     const userEmails = JSON.parse(localStorage.getItem("userEmails")) || [];

//     // Check if userEmails is empty and toast has not been shown
//     if (userEmails.length === 0 && !localStorage.getItem("welcomeToastShown")) {
//       toast.success(
//         "Welcome to the Help Desk! Please submit a ticket to get started."
//       );

//       // Set a flag in localStorage to indicate the toast has been shown
//       localStorage.setItem("welcomeToastShown", "true");
//     }
//   }, []);

//   useEffect(() => {
//     const userEmails = JSON.parse(localStorage.getItem("userEmails")) || [];

//     const dbRef = ref(database, "tickets");

//     onValue(
//       dbRef,
//       (snapshot) => {
//         const data = snapshot.val();
//         if (data) {
//           const userTickets = Object.keys(data)
//             .filter((key) => userEmails.includes(data[key].email))
//             .map((key) => ({ id: key, ...data[key] }));
//           setTickets(userTickets);
//           setFilteredTickets(userTickets); // Initially show all user tickets
//         } else {
//           setTickets([]);
//           setFilteredTickets([]);
//         }
//       },
//       (error) => {
//         console.error("Error fetching tickets: ", error);
//         toast.error("Error fetching tickets!");
//       }
//     );
//   }, []);

//   useEffect(() => {
//     if (selectedFilter === "All") {
//       setFilteredTickets(tickets);
//     } else {
//       setFilteredTickets(
//         tickets.filter((ticket) => ticket.status === selectedFilter)
//       );
//     }
//   }, [selectedFilter, tickets]);

//   return (
//     <main className={styles.main}>
//       <Toaster />
//       <h1 className={styles.heading}>Help Desk</h1>
//       <TicketForm onSubmit={() => {}} />
//       {/* <FilterButtons
//         selectedFilter={selectedFilter}
//         setSelectedFilter={setSelectedFilter}
//       /> */}
//       <TicketList tickets={filteredTickets} />
//     </main>
//   );
// }
