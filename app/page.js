// pages/index.js
"use client";

import styles from "./page.module.css";
import { useState, useEffect } from "react";
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

  useEffect(() => {
    const dbRef = ref(database, "tickets");

    onValue(dbRef, (snapshot) => {
      const data = snapshot.val();
      const tickets = [];
      for (let id in data) {
        tickets.push({ id, ...data[id] });
      }
      setTickets(tickets);
      setFilteredTickets(tickets); // Initially show all tickets
    });
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
      <TicketForm onSubmit={() => {}} />
      <FilterButtons
        selectedFilter={selectedFilter}
        setSelectedFilter={setSelectedFilter}
      />
      <TicketList tickets={filteredTickets} />
    </main>
  );
}
