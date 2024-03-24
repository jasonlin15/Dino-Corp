import sqlite3 from 'sqlite3'
import { open, Database } from 'sqlite'
import argon2 from 'argon2'

import { EventProposal } from './events'

const databasePath = './database.sqlite'

let db: Database<sqlite3.Database, sqlite3.Statement>

export async function openDb() {
    db = await open({
        filename: databasePath,
        driver: sqlite3.Database
    })

    await db.run(`
        CREATE TABLE IF NOT EXISTS eventProposals (
            id INTEGER PRIMARY KEY AUTOINCREMENT,
            name TEXT,
            description TEXT,
            organization TEXT,
            tags TEXT,
            duration INTEGER,
            password TEXT
        )
    `);

    await db.run(`
        CREATE TABLE IF NOT EXISTS times (
            id INTEGER PRIMARY KEY AUTOINCREMENT,
            eventId INTEGER,
            interestedOrgId INTEGER,
            begin DATETIME,
            end DATETIME,
            FOREIGN KEY (eventId) REFERENCES eventProposals(id),
            FOREIGN KEY (interestedOrgId) REFERENCES interestedOrgs(id)
        )
    `);

    await db.run(`
        CREATE TABLE IF NOT EXISTS interestedOrgs (
            id INTEGER PRIMARY KEY AUTOINCREMENT,
            eventId INTEGER,
            name TEXT,
            contactInfo TEXT,
            FOREIGN KEY (eventId) REFERENCES eventProposals(id)
        )
    `);
}

// Function to hash and salt the password
async function hashPassword(password: string): Promise<string> {
    try {
        const hashedPassword = await argon2.hash(password);
        return hashedPassword;
    } catch (error) {
        console.error('Error hashing password:', error);
        throw error;
    }
}

export async function addEventProposal(proposal: EventProposal): Promise<void> {
    try {
        // Insert event proposal into eventProposals table
        const insertProposalQuery = `
            INSERT INTO eventProposals (name, description, organization, tags, duration, password)
            VALUES (?, ?, ?, ?, ?, ?)
        `;
        const proposalParams = [
            proposal.name,
            proposal.description,
            proposal.organization,
            proposal.tags.map(tag => tag.replace(/[^a-z0-9]/gi, '')).join(';'),
            proposal.duration,
            await hashPassword(proposal.password)
        ];
        const lastID = await db.run(insertProposalQuery, ...proposalParams);

        // Insert timeslots into times table
        const insertTimeslotQuery = `
            INSERT INTO times (eventId, begin, end)
            VALUES (?, ?, ?)
        `;
        for (const timeslot of proposal.times) {
            const timeslotParams = [
                lastID.lastID,
                timeslot.startTime.toISOString(),
                timeslot.endTime.toISOString()
            ];
            await db.run(insertTimeslotQuery, ...timeslotParams);
        }
    } catch (error) {
        console.error('Error adding event proposal:', error);
        throw error;
    }
}

async function convertEventFromDatabase(event: any): Promise<EventProposal> {
    const timeslots = await db.all(
        'SELECT * FROM times WHERE eventId = ?',
        event.id
    );
    return {
        id: event.id,
        name: event.name,
        description: event.description,
        organization: event.organization,
        tags: event.tags.split(';'),
        duration: event.duration,
        times: timeslots.map((timeslot: any) => ({
            startTime: new Date(timeslot.begin),
            endTime: new Date(timeslot.end)
        })),
        password: ""
    };
}

async function convertEventsFromDatabase(events: any[]): Promise<EventProposal[]> {
    return Promise.all(events.map(convertEventFromDatabase));
}

export async function searchEvents(keyword: string): Promise<EventProposal[]> {
    try {
        const query = `
            SELECT * FROM eventProposals
            WHERE name LIKE '%' || ? || '%'
            OR organization LIKE '%' || ? || '%'
            OR tags LIKE '%' || ? || '%'
            OR description LIKE '%' || ? || '%'
        `;
        const events = await db.all(query, keyword, keyword, keyword, keyword);
        return convertEventsFromDatabase(events);
    } catch (error) {
        console.error('Error searching events:', error);
        throw error;
    }
}

export async function searchEventsWithFilters(keyword: string, durationMin: number | undefined, durationMax: number | undefined, begin: Date | undefined, end: Date | undefined): Promise<EventProposal[]> {
    try {
        let query = `
            SELECT * FROM eventProposals
            WHERE name LIKE '%' || ? || '%'
            OR organization LIKE '%' || ? || '%'
            OR tags LIKE '%' || ? || '%'
            OR description LIKE '%' || ? || '%'
            ${durationMin && durationMax ? 'AND duration BETWEEN ? AND ?' : ''}
            ${begin && end ? `AND EXISTS (
                SELECT 1 FROM times
                WHERE eventProposals.id = times.eventId
                AND begin >= ?
                AND end <= ?
            )` : ''}
        `;
        const params = [keyword, keyword, keyword, keyword];
        if (durationMin && durationMax) {
            params.push(durationMin.toString());
            params.push(durationMax.toString());
        }
        if (begin && end) {
            params.push(begin.toISOString());
            params.push(end.toISOString());
        }
        const events = await db.all(query, ...params);
        return convertEventsFromDatabase(events);
    } catch (error) {
        console.error('Error searching events with filters:', error);
        throw error;
    }
}

export async function addInterestedOrg(eventId: number, orgName: string, contactInfo: string): Promise<void> {
    try {
        const insertOrgQuery = `
            INSERT INTO interestedOrgs (eventId, name, contactInfo)
            VALUES (?, ?, ?)
        `;
        const orgParams = [eventId, orgName, contactInfo];
        await db.run(insertOrgQuery, ...orgParams);
    } catch (error) {
        console.error('Error adding interested organization:', error);
        throw error;
    }
}

export async function deleteEventProposal(eventId: number, password: string): Promise<void> {
    // check password
    const checkPasswordQuery = `
        SELECT password FROM eventProposals
        WHERE id = ?
    `;
    const event = await db.get(checkPasswordQuery, eventId);
    if (!event) {
        // throw new Error('Event not found');
        return;
    }
    const validPassword = await argon2.verify(event.password, password);
    if (!validPassword) {
        // throw new Error('Invalid password');
        return;
    }

    try {
        // Delete event proposal from eventProposals table
        const deleteProposalQuery = `
            DELETE FROM eventProposals
            WHERE id = ?
        `;
        await db.run(deleteProposalQuery, eventId);
        // Delete associated timeslots from times table
        const deleteTimeslotsQuery = `
            DELETE FROM times
            WHERE eventId = ?
        `;
        await db.run(deleteTimeslotsQuery, eventId);
        // Delete associated interested organizations from interestedOrgs table
        const deleteInterestedOrgsQuery = `
            DELETE FROM interestedOrgs
            WHERE eventId = ?
        `;
        await db.run(deleteInterestedOrgsQuery, eventId);
    } catch (error) {
        console.error('Error deleting event proposal:', error);
        throw error;
    }
}
