// components/TicketList.js
"use client";

import React, { useState, useEffect } from "react";
import styles from "../page.module.css";
import Skeleton from "react-loading-skeleton";
import "react-loading-skeleton/dist/skeleton.css";

const TicketList = ({ tickets, onEdit }) => {
  const [showSkeleton, setShowSkeleton] = useState(true); // State to control skeleton visibility

  useEffect(() => {
    const timer = setTimeout(() => {
      setShowSkeleton(false); // Hide skeletons after 3 seconds
    }, 1000);

    return () => clearTimeout(timer); // Cleanup the timer on unmount or state change
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
          <Skeleton count={1} width={400} height={230} />
          <Skeleton count={1} width={400} height={230} />
          <Skeleton count={1} width={400} height={230} />
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
                  {ticket.answer && <p>Answer: {ticket.answer}</p>}
                </div>
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
