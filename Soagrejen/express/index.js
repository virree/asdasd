const express = require('express');
const app = express();
const PORT = 5001;
const jsonGrej = "{\"columnheaders\":[\"\",\"Activity\",\"Location, Room\",\"Employee, Student\",\"Comment\",\"Zoom link\",\"Course\",\"Course code\"],\"info\":{\"reservationlimit\":1000,\"reservationcount\":12},\"reservations\":[{\"id\":\"1010710\",\"startdate\":\"2024-12-24\",\"starttime\":\"08:00\",\"enddate\":\"2024-12-25\",\"endtime\":\"08:00\",\"columns\":[\"Julafton\",\"\",\"\",\"\",\"\",\"\",\"\",\"\"]},{\"id\":\"1010707\",\"startdate\":\"2024-12-25\",\"starttime\":\"08:00\",\"enddate\":\"2024-12-26\",\"endtime\":\"08:00\",\"columns\":[\"Juldagen\",\"\",\"\",\"\",\"\",\"\",\"\",\"\"]},{\"id\":\"1010708\",\"startdate\":\"2024-12-26\",\"starttime\":\"08:00\",\"enddate\":\"2024-12-27\",\"endtime\":\"08:00\",\"columns\":[\"Annandag jul\",\"\",\"\",\"\",\"\",\"\",\"\",\"\"]},{\"id\":\"1010704\",\"startdate\":\"2024-12-31\",\"starttime\":\"08:00\",\"enddate\":\"2025-01-01\",\"endtime\":\"08:00\",\"columns\":[\"Nyårsafton\",\"\",\"\",\"\",\"\",\"\",\"\",\"\"]},{\"id\":\"1010703\",\"startdate\":\"2025-01-01\",\"starttime\":\"08:00\",\"enddate\":\"2025-01-02\",\"endtime\":\"08:00\",\"columns\":[\"Nyårsdagen\",\"\",\"\",\"\",\"\",\"\",\"\",\"\"]},{\"id\":\"1010701\",\"startdate\":\"2025-01-06\",\"starttime\":\"08:00\",\"enddate\":\"2025-01-07\",\"endtime\":\"08:00\",\"columns\":[\"Trettondag jul\",\"\",\"\",\"\",\"\",\"\",\"\",\"\"]},{\"id\":\"1043860\",\"startdate\":\"2025-01-07\",\"starttime\":\"10:15\",\"enddate\":\"2025-01-07\",\"endtime\":\"11:45\",\"columns\":[\"\",\"Tutoring\",\"Zoom\",\"Diana Chroneer, Jennie Gelter\",\"\",\"https://ltu-se.zoom.us/j/138791984\",\"\",\"D0023E, D0023E\"]},{\"id\":\"1010692\",\"startdate\":\"2025-04-18\",\"starttime\":\"08:00\",\"enddate\":\"2025-04-19\",\"endtime\":\"08:00\",\"columns\":[\"Långfredagen\",\"\",\"\",\"\",\"\",\"\",\"\",\"\"]},{\"id\":\"1010694\",\"startdate\":\"2025-04-21\",\"starttime\":\"08:00\",\"enddate\":\"2025-04-22\",\"endtime\":\"08:00\",\"columns\":[\"Annandag påsk\",\"\",\"\",\"\",\"\",\"\",\"\",\"\"]},{\"id\":\"1010695\",\"startdate\":\"2025-05-01\",\"starttime\":\"08:00\",\"enddate\":\"2025-05-02\",\"endtime\":\"08:00\",\"columns\":[\"Första maj\",\"\",\"\",\"\",\"\",\"\",\"\",\"\"]},{\"id\":\"1010696\",\"startdate\":\"2025-05-29\",\"starttime\":\"08:00\",\"enddate\":\"2025-05-30\",\"endtime\":\"08:00\",\"columns\":[\"Kristi himmelfärdsdag\",\"\",\"\",\"\",\"\",\"\",\"\",\"\"]},{\"id\":\"1010698\",\"startdate\":\"2025-06-06\",\"starttime\":\"08:00\",\"enddate\":\"2025-06-07\",\"endtime\":\"08:00\",\"columns\":[\"Sveriges nationaldag\",\"\",\"\",\"\",\"\",\"\",\"\",\"\"]}]}"

app.use(express.json());
require('dotenv').config(); // Load .env file
const API_TOKEN = process.env.CANVAS_API_TOKEN;
const CANVAS_DOMAIN = 'https://canvas.ltu.se';
// Basic route
app.get('/', (req, res) => {
    res.send('Hello from Express!');
});

// Start the server
app.listen(PORT, () => {
    console.log(`Server is running at http://localhost:${PORT}`);
});

//post calender grej
// curl localhost:5001/oh

//asd

app.post('/calendarEvent', async (req, res) => {
    try{



        console.log('Received POST request to /calendarEvent with header:', req.headers);
        console.log('Received POST request to /calendarEvent with body:', req.body);
        if (!req.body) {
            return res.status(400).json({error: 'Missing request body'});
        }
        if (!req.body.context_code) {
            return res.status(400).json({error: 'Missing context code'});
        }

        const calendarEvent = {
            "calendar_event": {
                "context_code": req.body.context_code,
                "title": req.body.title,
                "start_at": req.body.start_at,
                "end_at": req.body.end_at,
                "description": req.body.description,
                "location_name": req.body.location_name,
                "location_address": req.body.location_address,
            }
        };

        const response = await fetch(`${CANVAS_DOMAIN}/api/v1/calendar_events`, {
            method: 'POST',
            headers: {
                'Authorization': `Bearer ${API_TOKEN}`,
                'Content-Type': 'application/json',
                'Accept': 'application/json'
            },
            body: JSON.stringify(calendarEvent),
        });

        if (!response.ok) {
            console.log(response);
            throw new Error(`Error fetching calendar events: ${response.status} ${response.statusText}`);
        }
        const data = await response.json();
        res.json(data);



    }catch (error) {
        console.error('Error:', error.message);
        res.status(500).json({error: 'Failed to fetch calendar events'});
    }


});

//calender event
app.post('/ah', async (req, res) => {
    try{
        const parse = JSON.parse(jsonGrej);
        const reservation = parse.reservations[6]; // Ensure this index exists

        if (!reservation) {
            return res.status(400).json({ error: 'Reservation not found.' });
        }

        const context_code = `user_146040`;
        const title = reservation.columns[1];
        const description = reservation.columns[4];
        const start_at = `${reservation.startdate}T${reservation.starttime}:00Z`;
        const end_at = `${reservation.enddate}T${reservation.endtime}:00Z`;

        const calendarEvent = {
            "calendar_event": {
                "context_code": context_code,
                "title": title,
                "start_at": start_at,
                "end_at": end_at,
                "description": description,
            }
        };

        const response = await fetch(`${CANVAS_DOMAIN}/api/v1/calendar_events`, {
            method: 'POST',
            headers: {
                'Authorization': `Bearer ${API_TOKEN}`,
                'Content-Type': 'application/json',
                'Accept': 'application/json'
            },
            body: JSON.stringify(calendarEvent),
        });

        if (!response.ok) {
            console.log(response);
            throw new Error(`Error fetching calendar events: ${response.status} ${response.statusText}`);
        }
        const data = await response.json();
        res.json(data);

    }catch (error) {
        console.error('Error:', error.message);
        res.status(500).json({ error: 'Failed to fetch calendar events' });
    }



});


app.get('/oh', async (req, res) => {
    try {
        const parse = JSON.parse(jsonGrej);
        const reservation = parse.reservations[6]; // Ensure this index exists

        if (!reservation) {
            return res.status(400).json({ error: 'Reservation not found.' });
        }

        // Extract necessary fields
        const title = reservation.columns[1];
        const details = reservation.columns[4];
        const todo_date = reservation.startdate;
        const course_id = 22140;
        const linked_object_type = 'assignment';
        const linked_object_id = 67890;
        const start_time = reservation.starttime;
        const end_time = reservation.endtime;

        // Prepare the planner note data
        const plannerNoteData = {
                "title": title,
                "details": `${details}\nStart Time: ${start_time}\nEnd Time: ${end_time}`,
                "todo_date": `${todo_date} + ´t´ + ${start_time}`+ ":00Z",
                "description": "This is a planner note created by the API",
                "course_id": course_id,
        };



        const response = await fetch(`${CANVAS_DOMAIN}/api/v1/planner_notes`, {
            method: 'POST',
            headers: {
                'Authorization': `Bearer ${API_TOKEN}`,
                'Content-Type': 'application/json',
            },
            body: JSON.stringify(plannerNoteData),
        });

        if (!response.ok) {
            console.log(response);
            throw new Error(`Error fetching calendar events: ${response.status} ${response.statusText}`);
        }

        const data = await response.json();
        res.json(data);


    }catch (error) {
        console.error('Error:', error.message);
        res.status(500).json({ error: 'Failed to fetch calendar events' });
    }
});



app.get('/tjena', async (req, res) => {
    try {
        const response = await fetch(`${CANVAS_DOMAIN}/api/v1/courses`, {
            method: 'GET',
            headers: {
                'Authorization': `Bearer ${API_TOKEN}`, // Use the token securely
                'Content-Type': 'application/json'
            },
        });

        if (!response.ok) {
            throw new Error(`Error fetching calendar events: ${response.status} ${response.statusText}`);
        }

        const data = await response.json();
        const back = data.map(course => ({
            id: course.id,
            name: course.name,
        }));
        res.json(back);
        for (const course of data) {
            console.log(`Course ID: ${course.id}, Name: ${course.name}`);
        };

    } catch (error) {
        console.error('Error:', error.message);
        res.status(500).json({ error: 'Failed to fetch calendar events' });
    }
});


