// components/TicketForm.js
"use client";

import styles from "../page.module.css";
import { useState, useEffect } from "react";
import toast from "react-hot-toast";
import { push, ref, update } from "firebase/database";
import { database } from "../firebaseConfig";

const TicketForm = ({ ticketId, initialData, onSubmit }) => {
  const [name, setName] = useState(initialData?.name || "");
  const [email, setEmail] = useState(initialData?.email || "");
  const [description, setDescription] = useState(
    initialData?.description || ""
  );
  const [answer, setAnswer] = useState(initialData?.answer || "");

  useEffect(() => {
    if (initialData) {
      setName(initialData.name);
      setEmail(initialData.email);
      setDescription(initialData.description);
      setAnswer(initialData.answer);
    }
  }, [initialData]);

  const handleData = () => {
    if (!ticketId && !initialData) {
      const newTicketData = {
        name: name,
        email: email,
        description: description,
        status: "New",
      };

      const dbRef = ref(database, "tickets");

      push(dbRef, newTicketData)
        .then(() => {
          setName("");
          setEmail("");
          setDescription("");
          toast.success("Ticket created successfully!");
          onSubmit();
        })
        .catch((error) => {
          console.error("Error adding ticket: ", error);
          toast.error("Error adding ticket!");
        });
    } else {
      const dbRef = ref(database, `tickets/${ticketId}`);

      const updates = {
        name: name,
        email: email,
        description: description,
        status: "Resolved",
        answer: answer,
      };

      update(dbRef, updates)
        .then(() => {
          setName("");
          setEmail("");
          setDescription("");
          setAnswer("");
          toast.success("Ticket updated successfully!");
          onSubmit();
        })
        .catch((error) => {
          console.error("Error updating ticket: ", error);
          toast.error("Error updating ticket!");
        });
    }
  };

  return (
    <form className={styles.form}>
      <label className={styles.label}>
        Name:
        <input
          className={styles.input}
          type="text"
          value={name}
          onChange={(e) => setName(e.target.value)}
        />
      </label>
      <label className={styles.label}>
        Email:
        <input
          className={styles.input}
          type="email"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
        />
      </label>
      <label className={styles.label}>
        Description:
        <textarea
          className={styles.textarea}
          value={description}
          onChange={(e) => setDescription(e.target.value)}
        />
      </label>
      {ticketId && (
        <label className={styles.label}>
          Answer:
          <textarea
            className={styles.textarea}
            value={answer}
            onChange={(e) => setAnswer(e.target.value)}
          />
        </label>
      )}
      <button className={styles.button} type="button" onClick={handleData}>
        Submit
      </button>
    </form>
  );
};

export default TicketForm;
