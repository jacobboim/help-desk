// pages/admin.js
"use client";

import styles from "../page.module.css";
import { useState, useEffect } from "react";
import { ref, onValue, update } from "firebase/database";
import { database } from "../firebaseConfig";
import toast, { Toaster } from "react-hot-toast";
import TicketForm from "../components/TicketForm";
import TicketListAdmin from "../components/TicketListAdmin";
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
      <h1 className={styles.heading}>Help Desk Admin</h1>
      {/* <TicketForm
        ticketId={ticketId}
        initialData={initialData}
        onSubmit={() => setTicketId(null)}
      /> */}
      <FilterButtons
        selectedFilter={selectedFilter}
        setSelectedFilter={setSelectedFilter}
      />
      <TicketListAdmin tickets={filteredTickets} onEdit={handleEdit} />
    </main>
  );
};

export default AdminPage;
