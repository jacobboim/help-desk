// components/FilterButtons.js
"use client";

import styles from "../page.module.css";

const FilterButtons = ({ selectedFilter, setSelectedFilter }) => {
  const filterStyles = (filter) => {
    return selectedFilter === filter ? styles.selectedFilter : styles.filter;
  };

  return (
    <div className={styles.filterContainer}>
      {["All", "New", "In Progress", "Resolved"].map((filter) => (
        <button
          key={filter}
          className={filterStyles(filter)}
          onClick={() => setSelectedFilter(filter)}
        >
          {filter}
        </button>
      ))}
    </div>
  );
};

export default FilterButtons;