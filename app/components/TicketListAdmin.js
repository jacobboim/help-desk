// components/TicketListAdmin.js
import React, { useState, useEffect } from "react";
import styles from "../page.module.css";
import Skeleton from "react-loading-skeleton";
import "react-loading-skeleton/dist/skeleton.css";
import Modal from "./Modal"; // Import the Modal component
import { ref, update } from "firebase/database";
import { database } from "../firebaseConfig"; // Ensure this path is correct

import { isMobile } from "react-device-detect";
const TicketListAdmin = ({ tickets, onEdit }) => {
  const [showSkeleton, setShowSkeleton] = useState(true); // State to control skeleton visibility
  const [showModal, setShowModal] = useState(false); // State to control modal visibility
  const [selectedTicket, setSelectedTicket] = useState(null); // State to track selected ticket
  const [newStatus, setNewStatus] = useState(""); // State to store selected status
  const [answer, setAnswer] = useState(""); // State to store ticket answer
  const [showAnswerModal, setShowAnswerModal] = useState(false); // State to control answer modal visibility

  useEffect(() => {
    const timer = setTimeout(() => {
      setShowSkeleton(false); // Hide skeletons after 3 seconds
    }, 1000);

    return () => clearTimeout(timer); // Cleanup the timer on unmount or state change
  }, []);

  const openModal = (ticket) => {
    setSelectedTicket(ticket);
    setShowModal(true);
  };

  const closeModal = () => {
    setShowModal(false);
    setSelectedTicket(null);
    setNewStatus("");
  };

  const openAnswerModal = (ticket) => {
    setSelectedTicket(ticket);
    setAnswer(ticket.answer || ""); // Set current answer if it exists
    setShowAnswerModal(true);
  };

  const closeAnswerModal = () => {
    setShowAnswerModal(false);
    setSelectedTicket(null);
    setAnswer("");
  };

  const handleUpdateStatus = () => {
    if (!selectedTicket || !newStatus) {
      console.error("No ticket or status selected.");
      return;
    }

    const dbRef = ref(database, `tickets/${selectedTicket.id}`);

    const updates = {
      status: newStatus,
    };

    update(dbRef, updates)
      .then(() => {
        closeModal(); // Close modal after successful update
      })
      .catch((error) => {
        closeModal(); // Close modal after successful update

        console.error("Error updating ticket status: ", error);
        // Handle error, show toast, etc.
      });
  };

  const handleUpdateAnswer = () => {
    if (!selectedTicket || !answer) {
      console.error("No ticket or answer provided.");
      return;
    }

    const dbRef = ref(database, `tickets/${selectedTicket.id}`);

    const updates = {
      answer: answer,
      status: "Resolved", // Update status to Resolved when answering
    };

    update(dbRef, updates)
      .then(() => {
        console.log(`Ticket ${selectedTicket.id} answer updated.`);
        closeAnswerModal(); // Close modal after successful update
      })
      .catch((error) => {
        console.error("Error updating ticket answer: ", error);
        closeAnswerModal(); // Close modal on error
        // Handle error, show toast, etc.
      });
  };

  const statusStyles = {
    New: styles.statusNew,
    "In Progress": styles.statusInProgress,
    Resolved: styles.statusResolved,
  };

  return (
    <>
      {showSkeleton && (
        <div className={styles.skeletonWrapper}>
          <Skeleton count={1} width={isMobile ? 320 : 400} height={230} />
          <Skeleton count={1} width={isMobile ? 320 : 400} height={230} />
          <Skeleton count={1} width={isMobile ? 320 : 400} height={230} />
        </div>
      )}

      <div className={styles.cardContainer}>
        {!showSkeleton &&
          tickets.map((ticket) => (
            <div key={ticket.id} className={styles.card}>
              <div
                className={`${styles.status} ${statusStyles[ticket.status]}`}
              >
                {ticket.status}
              </div>
              <div className={styles.cardHeader}>{ticket.name}</div>
              <div className={styles.cardBody}>
                <p>Email: {ticket.email}</p>
                <div className={styles.description}>
                  <p>Description: {ticket.description}</p>
                </div>
                {ticket.answer && (
                  <p className={styles.answer}>Answer: {ticket.answer}</p>
                )}
              </div>
              <div className={styles.editButtonContainer}>
                <button
                  className={styles.editButton}
                  onClick={() => openModal(ticket)}
                >
                  Edit
                </button>
                <button
                  className={styles.answerButton}
                  onClick={() => openAnswerModal(ticket)}
                >
                  Answer
                </button>
              </div>
            </div>
          ))}
      </div>

      {showModal && (
        <Modal closeModal={closeModal}>
          <h2
            style={{
              marginBottom: "1rem",
            }}
          >
            Update Ticket Status
          </h2>
          <div className={styles.statusButtons}>
            <button
              className={`${styles.statusButton} ${
                newStatus === "New" ? styles.activeButton : ""
              }`}
              onClick={() => setNewStatus("New")}
            >
              New
            </button>
            <button
              className={`${styles.statusButton} ${
                newStatus === "In Progress" ? styles.activeButton : ""
              }`}
              onClick={() => setNewStatus("In Progress")}
            >
              In Progress
            </button>
            <button
              className={`${styles.statusButton} ${
                newStatus === "Resolved" ? styles.activeButton : ""
              }`}
              onClick={() => setNewStatus("Resolved")}
            >
              Resolved
            </button>
          </div>
          <div className={styles.submitCont}>
            <button
              className={styles.submitButton}
              onClick={handleUpdateStatus}
            >
              Submit
            </button>
            <button className={styles.cancelButton} onClick={closeModal}>
              Cancel
            </button>
          </div>
        </Modal>
      )}

      {showAnswerModal && (
        <Modal closeModal={closeAnswerModal}>
          <h2
            style={{
              marginBottom: "1rem",
            }}
          >
            Update Ticket Answer
          </h2>
          <textarea
            className={styles.answerInput}
            value={answer}
            onChange={(e) => setAnswer(e.target.value)}
            placeholder="Enter answer..."
          />
          <div className={styles.submitCont}>
            <button
              className={styles.submitButton}
              onClick={handleUpdateAnswer}
            >
              Submit Answer
            </button>
            <button className={styles.cancelButton} onClick={closeAnswerModal}>
              Cancel
            </button>
          </div>
        </Modal>
      )}
    </>
  );
};

export default TicketListAdmin;
