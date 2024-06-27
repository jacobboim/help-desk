// pages/admin.js
"use client";

import styles from "../page.module.css";
import { useState, useEffect } from "react";
import { ref, onValue, update } from "firebase/database";
import { database } from "../firebaseConfig";
import toast, { Toaster } from "react-hot-toast";
import TicketForm from "../components/TicketForm";
import TicketList from "../components/TicketList";
import FilterButtons from "../components/FilterButtons";

const AdminPage = () => {
  const [tickets, setTickets] = useState([]);
  const [filteredTickets, setFilteredTickets] = useState([]);
  const [selectedFilter, setSelectedFilter] = useState("All");
  const [ticketId, setTicketId] = useState(null);
  const [initialData, setInitialData] = useState({});

  useEffect(() => {
    const dbRef = ref(database, "tickets");

    onValue(dbRef, (snapshot) => {
      const data = snapshot.val();
      const tickets = data
        ? Object.keys(data).map((key) => ({ id: key, ...data[key] }))
        : [];
      setTickets(tickets);
      setFilteredTickets(tickets); // Initially show all tickets
    });
  }, []);

  useEffect(() => {
    if (ticketId) {
      handleInProgress();
    }
  }, [ticketId]);

  useEffect(() => {
    if (selectedFilter === "All") {
      setFilteredTickets(tickets);
    } else {
      setFilteredTickets(
        tickets.filter((ticket) => ticket.status === selectedFilter)
      );
    }
  }, [selectedFilter, tickets]);

  const handleInProgress = () => {
    if (!ticketId) {
      console.error("No ticket ID selected for update.");
      return;
    }

    const dbRef = ref(database, `tickets/${ticketId}`);

    const updates = {
      status: "In Progress",
    };

    update(dbRef, updates)
      .then(() => {
        toast.success("Ticket status: In Progress!");
      })
      .catch((error) => {
        console.error("Error updating ticket status to In Progress: ", error);
        toast.error("Error updating ticket status to In Progress!");
      });
  };

  const handleEdit = (ticket) => {
    setInitialData(ticket);
    setTicketId(ticket.id);
  };

  return (
    <main className={styles.main}>
      <Toaster />
      <h1 className={styles.heading}>Help Desk</h1>
      <TicketForm
        ticketId={ticketId}
        initialData={initialData}
        onSubmit={() => setTicketId(null)}
      />
      <FilterButtons
        selectedFilter={selectedFilter}
        setSelectedFilter={setSelectedFilter}
      />
      <TicketList tickets={filteredTickets} onEdit={handleEdit} />
    </main>
  );
};

export default AdminPage;

// "use client";

// import styles from "../page.module.css";
// import { ref, onValue, update } from "firebase/database";
// import { useState, useEffect } from "react";
// import { database } from "../firebaseConfig";
// import toast, { Toaster } from "react-hot-toast";

// const AdminPage = () => {
//   const [name, setName] = useState("");
//   const [email, setEmail] = useState("");
//   const [description, setDescription] = useState("");
//   const [answer, setAnswer] = useState("");
//   const [tickets, setTickets] = useState([]);
//   const [filteredTickets, setFilteredTickets] = useState([]);
//   const [selectedFilter, setSelectedFilter] = useState("All");
//   const [ticketId, setTicketId] = useState(null); // Initialize ticketId state

//   useEffect(() => {
//     const dbRef = ref(database, "tickets");

//     const unsubscribe = onValue(dbRef, (snapshot) => {
//       const data = snapshot.val();
//       const tickets = data
//         ? Object.keys(data).map((key) => ({ id: key, ...data[key] }))
//         : [];
//       setTickets(tickets);
//       setFilteredTickets(tickets); // Initially show all tickets
//     });

//     return () => unsubscribe();
//   }, []);

//   useEffect(() => {
//     if (ticketId) {
//       handleInProgress();
//     }
//   }, [ticketId]); // Trigger when ticketId changes

//   useEffect(() => {
//     // Filter tickets based on the selected filter
//     if (selectedFilter === "All") {
//       setFilteredTickets(tickets);
//     } else {
//       setFilteredTickets(
//         tickets.filter((ticket) => ticket.status === selectedFilter)
//       );
//     }
//   }, [selectedFilter, tickets]);

//   const handleData = () => {
//     if (!ticketId) {
//       console.error("No ticket ID selected for update.");
//       return;
//     }

//     const dbRef = ref(database, `tickets/${ticketId}`);

//     const updates = {
//       name: name,
//       email: email,
//       description: description,
//       status: "Resolved",
//       answer: answer,
//     };

//     update(dbRef, updates)
//       .then(() => {
//         setName("");
//         setEmail("");
//         setDescription("");
//         setAnswer("");
//         setTicketId(null);
//         console.log("Would normally send email here with body:", updates);
//         toast.success("Ticket updated successfully!");
//       })
//       .catch((error) => {
//         console.error("Error updating ticket: ", error);
//         toast.error("Error updating ticket!");
//       });
//   };

//   const handleInProgress = () => {
//     if (!ticketId) {
//       console.error("No ticket ID selected for update.");
//       return;
//     }

//     const dbRef = ref(database, `tickets/${ticketId}`);

//     const updates = {
//       status: "In Progress",
//     };

//     update(dbRef, updates)
//       .then(() => {
//         toast.success("Ticket status: In Progress!");
//       })
//       .catch((error) => {
//         console.error("Error updating ticket status to In Progress: ", error);
//         toast.error("Error updating ticket status to In Progress!");
//       });
//   };

//   const statusStyles = {
//     New: styles.statusNew,
//     "In Progress": styles.statusInProgress,
//     Resolved: styles.statusResolved,
//   };

//   const filterStyles = (filter) => {
//     return selectedFilter === filter ? styles.selectedFilter : styles.filter;
//   };

//   return (
//     <main className={styles.main}>
//       <Toaster />
//       <h1 className={styles.heading}>Help Desk</h1>
//       <form className={styles.form}>
//         <label className={styles.label}>
//           Name:
//           <input
//             className={styles.input}
//             type="text"
//             value={name}
//             onChange={(e) => setName(e.target.value)}
//           />
//         </label>
//         <label className={styles.label}>
//           Email:
//           <input
//             className={styles.input}
//             type="email"
//             value={email}
//             onChange={(e) => setEmail(e.target.value)}
//           />
//         </label>
//         <label className={styles.label}>
//           Description:
//           <textarea
//             className={styles.textarea}
//             value={description}
//             onChange={(e) => setDescription(e.target.value)}
//           />
//         </label>
//         <label className={styles.label}>
//           Answer:
//           <textarea
//             className={styles.textarea}
//             value={answer}
//             onChange={(e) => setAnswer(e.target.value)}
//           />
//         </label>
//         <button className={styles.button} type="button" onClick={handleData}>
//           Submit
//         </button>
//       </form>

//       <div className={styles.filterContainer}>
//         {["All", "New", "In Progress", "Resolved"].map((filter) => (
//           <button
//             key={filter}
//             className={filterStyles(filter)}
//             onClick={() => setSelectedFilter(filter)}
//           >
//             {filter}
//           </button>
//         ))}
//       </div>

//       <div className={styles.cardContainer}>
//         {filteredTickets.map((ticket) => (
//           <div key={ticket.id} className={styles.card}>
//             <div className={`${styles.status} ${statusStyles[ticket.status]}`}>
//               {ticket.status}
//             </div>
//             <div className={styles.cardHeader}>{ticket.name}</div>
//             <div className={styles.cardBody}>
//               <p>Email: {ticket.email}</p>
//               <div className={styles.description}>
//                 <p>Description: {ticket.description}</p>
//                 <p>Answer: {ticket.answer}</p>
//               </div>
//             </div>
//             <button
//               className={styles.editButton}
//               onClick={() => {
//                 setName(ticket.name);
//                 setEmail(ticket.email);
//                 setDescription(ticket.description);
//                 setAnswer(ticket.answer);
//                 setTicketId(ticket.id);
//                 handleInProgress();
//               }}
//             >
//               Edit
//             </button>
//           </div>
//         ))}
//       </div>
//     </main>
//   );
// };

// export default AdminPage;
