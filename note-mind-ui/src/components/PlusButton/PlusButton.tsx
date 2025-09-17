import React from 'react';
import styles from './PlusButton.module.scss';

interface PlusButtonProps {
    onClick: () => void;
}

const PlusButton: React.FC<PlusButtonProps> = ({ onClick }) => {
    return (
        <button className={styles.plusButton} onClick={onClick}>
        +
        </button>
    );
};

export default PlusButton;