import React, { useEffect } from 'react';
import { getClassFeaturesAsync } from './classFeatsSlice';
import { useAppDispatch, useAppSelector } from '../../app/hooks';
import { RootState } from '../../app/store';

interface FeatProps {
    charName: string;
    charLevel: number;
}

const ClassFeatsComp = ({ charName, charLevel }: FeatProps) => {
    const dispatch = useAppDispatch();
    const feats = useAppSelector((state: RootState) => state.classTraits.classFeatures);
    const loading = useAppSelector((state: RootState) => state.classTraits.loading);

    useEffect(() => {
        dispatch(getClassFeaturesAsync(charName));
    }, [dispatch, charName]);

    if (loading) {
        return <div>Loading...</div>;
    }

    if (!feats || Object.keys(feats).length === 0) {
        return <div>No class features available.</div>;
    }

    // Log the feat levels for debugging
    console.log("Class Features Keys:", Object.keys(feats));
    console.log("Character Level:", charLevel);

    // Filter features based on character's level
    const filteredFeats = Object.entries(feats).filter(([levelKey]) => {
        // Normalize the levelKey to lowercase
        const level = parseInt(levelKey.toLowerCase().replace('level_', ''), 10);
        console.log(`Checking levelKey: ${levelKey}, Parsed level: ${level}`); // Log the level comparison
        return level <= charLevel;
    });

    if (filteredFeats.length === 0) {
        return <div>No available features for your level.</div>;
    }

    return (
        <div>
            <h2>Class Features</h2>
            <ul>
                {filteredFeats.map(([levelKey, features]) => {
                    const level = levelKey.toLowerCase().replace('level_', '').replace(/_/g, ' '); // Clean level string
                    return (
                        <li key={level}>
                            <h3>Level {level}:</h3>
                            <ul>
                                {Array.isArray(features) ? (
                                    features.map((feat, index) => (
                                        <li key={index}>
                                            <strong>{feat.name}</strong>
                                            <p>{feat.description}</p>
                                        </li>
                                    ))
                                ) : (
                                    <p>Invalid features for level {level}</p>
                                )}
                            </ul>
                        </li>
                    );
                })}
            </ul>
        </div>
    );
};

export default ClassFeatsComp;