//tring array of emails

// components/TicketList.js
"use client";

import React, { useState, useEffect } from "react";
import styles from "../page.module.css";
import Skeleton from "react-loading-skeleton";
import "react-loading-skeleton/dist/skeleton.css";
import { isMobile } from "react-device-detect";
import { ref, onValue } from "firebase/database";
import { database } from "../firebaseConfig";
import toast from "react-hot-toast";

const TicketList = ({ onEdit }) => {
  const [tickets, setTickets] = useState([]);
  const [showSkeleton, setShowSkeleton] = useState(true); // State to control skeleton visibility

  useEffect(() => {
    const userEmails = JSON.parse(localStorage.getItem("userEmails")) || [];
    // if (userEmails.length === 0) {
    //   toast.error("No user emails found. Please submit a ticket first.");
    //   setShowSkeleton(false);
    //   return;
    // }

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
        } else {
          setTickets([]);
        }
        setShowSkeleton(false); // Hide skeletons after data is loaded
      },
      (error) => {
        console.error("Error fetching tickets: ", error);
        toast.error("Error fetching tickets!");
        setShowSkeleton(false); // Hide skeletons even if there's an error
      }
    );
  }, []);

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
              {onEdit && (
                <div className={styles.editButtonContainer}>
                  <button
                    className={styles.editButton}
                    onClick={() => onEdit(ticket)}
                  >
                    Edit
                  </button>
                </div>
              )}
            </div>
          ))}
      </div>
    </>
  );
};

export default TicketList;
