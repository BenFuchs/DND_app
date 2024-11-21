import React, { useEffect } from 'react';
import { getClassFeaturesAsync } from './classFeatsSlice';
import { useAppDispatch, useAppSelector } from '../../app/hooks';
import { RootState } from '../../app/store';

interface FeatProps {
    charName: string;
}

const ClassFeatsComp = ({ charName }: FeatProps) => {
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

    return (
        <div>
            <h2>Class Features</h2>
            <ul>
                {Object.entries(feats).map(([levelKey, features]) => {
                    // Extract the numeric part of the level key (e.g., "level_1" -> "1")
                    const level = levelKey
                        .replace('level_', '') // Remove "level_" prefix
                        .replace(/_/g, ' '); // Ensure any remaining underscores are replaced with spaces
                    return (
                        <li key={level}>
                            <h3>{level}:</h3>
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
