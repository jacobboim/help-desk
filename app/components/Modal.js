// components/Modal.js
import React from "react";
import styles from "../page.module.css";

const Modal = ({ children, closeModal }) => {
  return (
    <div className={styles.modalBackdrop}>
      <div className={styles.modalContent}>
        <button className={styles.closeButton} onClick={closeModal}>
          &times;
        </button>
        {children}
      </div>
    </div>
  );
};

export default Modal;
