        async function queryDynamoDB() {

            //Clear the output division
            document.getElementById('result').innerText = " ";


            // Get the partition and sort key values from input fields
            const roomValue = document.getElementById('partitionValue').value;
            const sortValue = document.getElementById('sortValue').value;
            const dateValue = document.getElementById('dateValue').value;

            const partitionValue = roomValue + "-" + dateValue;

            let apiUrl = `https://uac13zk9va.execute-api.us-east-1.amazonaws.com/v1/smartsync?PartitionKey=${partitionValue}`;

            if (sortValue) {
                apiUrl += `&SortKey=${sortValue}`;
            }

            try {
                // Fetch data from the API
                const response = await fetch(apiUrl, {
                    method: 'GET',
                    headers: {
                        'Content-Type': 'application/json'
                    }
                });

                if (!response.ok) {
                    throw new Error(`HTTP error! Status: ${response.status}`);
                }

               //Response from GET request
                const rawData = await response.json(); //parses json string
                const data = typeof rawData === "string" ? JSON.parse(rawData) : rawData; //parses again due to double encoded JSON string


                //Error message output 
                if (data === "No Records Found") {
                    document.getElementById('result').innerHTML = `<p>${data}</p>`;
                    return;
                }

                //Sort the query in chronological order
                data.sort((a, b) => {
                    const parseTime = (timestamp) => {
                        const [time, modifier] = timestamp.split(' '); // Split time and AM/PM
                        let [hours, minutes, seconds] = time.split(':').map(Number); // Split into components

                            if (modifier === 'PM' && hours !== 12) {
                                hours += 12; // Convert PM to 24-hour format
                            } else if (modifier === 'AM' && hours === 12) {
                                hours = 0; // Handle midnight case
                            }

                            // Return total seconds since the start of the day
                            return hours * 3600 + minutes * 60 + seconds;
                    };
                    
                    //Sort the values
                    return parseTime(a.Timestamp) - parseTime(b.Timestamp);
                });

                // Safely delete the Room and Time property
                data.forEach(item => delete item.Room);
                data.forEach(item => delete item.Time);


                // Format the data for display
                const formattedData = data
                    .map(item => 
                        Object.entries(item)
                        .map(([key, value]) => `${key}: ${value}`)
                        .join('<br>') //line break in html
                    )
                    .join('<br><br>'); //line break in html

                // Update the result element
                document.getElementById('result').innerHTML = `<p>${formattedData}</p>`;
            
            } catch (error) {
                // Handle errors
                document.getElementById('result').innerText = `Error: ${error.message}`;
                console.error('Error querying DynamoDB:', error);
            }
        }

        //Query function for recorded incidents 
        async function QueryIncidents() {

            //Clear the output division
            document.getElementById('incidentresults').innerText = " ";

            //Extract the date value from input
            const selectedDate = document.getElementById('Fecha').value;

            //define api url 
            let incidentqueryAPI = `https://uac13zk9va.execute-api.us-east-1.amazonaws.com/v1/incidentQuery?DateValue=${selectedDate}`;


            try {
                // Fetch data from the API
                const response = await fetch(incidentqueryAPI, {
                    method: 'GET',
                    headers: {
                        'Content-Type': 'application/json'
                    }
                });

                if (!response.ok) {
                    throw new Error(`HTTP error! Status: ${response.status}`);
                }

                //Response from GET request 
                const rawData = await response.json(); //parses json string
                const data = typeof rawData === "string" ? JSON.parse(rawData) : rawData; //parses again due to double encoded JSON string

                if (data === "No Record Found") {
                    document.getElementById('incidentresults').innerHTML = `<p>${data}</p>`;
                    return;
                }

                //Sort the query in chronological order
                data.sort((a, b) => {
                    const parseTime = (timestamp) => {
                        const [time, modifier] = timestamp.split(' '); // Split time and AM/PM
                        let [hours, minutes, seconds] = time.split(':').map(Number); // Split into components

                            if (modifier === 'PM' && hours !== 12) {
                                hours += 12; // Convert PM to 24-hour format
                            } else if (modifier === 'AM' && hours === 12) {
                                hours = 0; // Handle midnight case
                            }

                            // Return total seconds since the start of the day
                            return hours * 3600 + minutes * 60 + seconds;
                    };
                    
                    //Sort the values
                    return parseTime(a.Timestamp) - parseTime(b.Timestamp);
                });

                // Safely delete the Room and Time property
                data.forEach(item => delete item.Room);
                data.forEach(item => delete item.Time);


                // Format the data for display
                const formattedData = data
                    .map(item => 
                        Object.entries(item)
                        .map(([key, value]) => `${key}: ${value}`)
                        .join('<br>') //line break in html
                    )
                    .join('<br><br>'); //line break in html

                // Update the result element
                document.getElementById('incidentresults').innerHTML = `<p>${formattedData}</p>`;
            
            } catch (error) {
                // Handle errors
                document.getElementById('incidentresults').innerText = `Error: ${error.message}`;
                console.error('Error querying DynamoDB:', error);
            }
        }
               
        async function incidentDashboard(){
             
            //Get date from system to only print todays incidents
            let systemDate = new Date();
            console.log(systemDate);
            let formattedDate = (systemDate.getMonth() + 1).toString().padStart(2, '0') + '/' + systemDate.getDate().toString().padStart(2, '0') + '/' + systemDate.getFullYear();
            
            //define api url 
            let incidentDashboardAPI = `https://uac13zk9va.execute-api.us-east-1.amazonaws.com/v1/incident?DateValue=${formattedDate}`;


            try {
                // Fetch data from the API
                const response = await fetch(incidentDashboardAPI, {
                    method: 'GET',
                    headers: {
                        'Content-Type': 'application/json'
                    }
                });

                if (!response.ok) {
                    throw new Error(`HTTP error! Status: ${response.status}`);
                }

                //Store response of GET request
                const data = await response.json();

                //Sort the query in chronological order
                data.sort((a, b) => {
                    const parseTime = (timestamp) => {
                        const [time, modifier] = timestamp.split(' '); // Split time and AM/PM
                        let [hours, minutes, seconds] = time.split(':').map(Number); // Split into components

                            if (modifier === 'PM' && hours !== 12) {
                                hours += 12; // Convert PM to 24-hour format
                            } else if (modifier === 'AM' && hours === 12) {
                                hours = 0; // Handle midnight case
                            }

                            // Return total seconds since the start of the day
                            return hours * 3600 + minutes * 60 + seconds;
                    };
                    
                    //Sort the values
                    return parseTime(a.Timestamp) - parseTime(b.Timestamp);
                });

                // Safely delete the Room and Time property
                data.forEach(item => delete item.Room);
                data.forEach(item => delete item.Time);

                //set flag for existing incidents 
                // Iterate through each item in the array
                for (const item of data) {
                    // Extract timestamp and location
                    const timestamp = item.Timestamp; // Replace 'timestamp' with the actual key in your data
                    const location = item.Location;   // Replace 'location' with the actual key in your data
                    
                    let timeDifference = CalculateDifference(timestamp);

                    if(timeDifference < 1800){
                    //update svg if system time within 30 minites from timestamp
                    monitorSvgUpdate(timestamp,location);
                    }
                }

                // Format the data for display
                const formattedData = data
                    .map(item => 
                        Object.entries(item)
                        .map(([key, value]) => `${key}: ${value}`)
                        .join('<br>') //line break in html
                    )
                    .join('<br><br>'); //line break in html

                // Update the result element
                document.getElementById('incidentDashboard').innerHTML = `<p>${formattedData}</p>`;

            } catch (error) {
                // Handle errors
                document.getElementById('incidentDashboard').innerText = `Error: ${error.message}`;
                console.error('Error querying DynamoDB:', error);
            }

        }
               

        // Step 1: Establish WebSocket connection
        const updatesocket = new WebSocket('wss://x290qiinj3.execute-api.us-east-1.amazonaws.com/production/');

        function initializeWebSocket() {
            // Step 2: Handle WebSocket events
            updatesocket.onopen = function() {
                console.log("WebSocket connection established!");
               
            };

            let messageList = []; // Array to store all messages
            let updateTimeout; // Variable to track the timeout

            updatesocket.onmessage = function(event) {
                console.log("Message received: ", event.data);

                let formattedData = event.data
                        .replace(/[\[\]{}\"']/g, '')  // Remove unwanted characters
                        .replace(/,/g, ',\n');         // Add a newline after every comma
                    
                // Add the formatted message to the list
                messageList.push(formattedData);

                // Restart the timeout timer for printing the dashboard
                if (updateTimeout) {
                    clearTimeout(updateTimeout); // Clear the existing timer
                }

                updateTimeout = setTimeout(() => {
                    printDashboard();
                    messageList = []; // Clear the list after printing
                }, 1000); // 1-second delay
                
            };

            function printDashboard() {
                // Update the "messages" div with the entire list
                document.getElementById("messages").innerHTML = messageList
                .map(message => `<p>${message}</p>`)
                .join(''); // Join the list of messages as HTML
            };

            updatesocket.onerror = function(error) {
                console.error("WebSocket error: ", error);
            };

            updatesocket.onclose = function() {
                console.log("WebSocket connection closed.");
                initializeWebSocket();
                
            };

        }

        //Establish incident report websocket
        const incidentsocket = new WebSocket('wss://aazjpa4x4d.execute-api.us-east-1.amazonaws.com/production/')

        function incidentWebSocket() {

            // Step 2: Handle WebSocket events
            incidentsocket.onopen = function() {
                console.log("WebSocket connection established!");
                
            };

            incidentsocket.onmessage = function(event) {
                console.log("Message received: ", event.data);
            
                // Parse the message into a JSON object
                let message = JSON.parse(event.data);
            
                // Remove the "Room" and "Time" properties from the object
                delete message.Room;
                delete message.Time;
            
                // Extract the timestamp and parse it
                let timestamp = message.Timestamp;
            
                // Convert the timestamp to the total number of seconds since midnight and check if it is within 30 minutes of system time
                let difference = CalculateDifference(timestamp);

                // Extract the location from the message
                let location = message.Location;
                
                //executeIfWithinTimeLimit(difference, location);
                monitorSvgUpdate(timestamp,location);
            
                // Format the data for display
                let formattedData = JSON.stringify(message)
                    .replace(/[\[\]{}\"']/g, '')  // Remove unwanted characters
                    .replace(/,/g, ',<br>')        // Add a newline after every comma
                    .replace(/,/g, '')             // Remove extra commas
                    .replace(/([^:\d]+):/g, '$1: '); // Only add space after colon for key-value pairs, not time
            
                // Display the formatted output on the page
                document.getElementById("incidentDashboard").innerHTML += `<p>${formattedData}</p>`;
            };
            
            
            incidentsocket.onerror = function(error) {
                console.error("WebSocket error: ", error);
            };

            incidentsocket.onclose = function() {
                console.log("WebSocket connection closed.");
                incidentWebSocket();
            };
        }

        //perform these function on window load
        window.onload = function() {
            initializeWebSocket(); //recent activity dashboard
            incidentDashboard(); //recent incident history GET request
            incidentWebSocket(); //receive messages of recorded incidents
        };

        //function to turn timestamp into number of seconds since midnight and give difference between system time and timestamp in seconds 
        function CalculateDifference(timestamp) {
            if (typeof timestamp === 'string') {
                // Trim any leading/trailing whitespace
                timestamp = timestamp.trim();
        
                // Regex to match format: "h:mm:ss AM/PM" or "hh:mm:ss AM/PM"
                const timeFormat = /^(\d{1,2}):(\d{2}):(\d{2})\s?(AM|PM)$/i;
        
                const match = timestamp.match(timeFormat);
                if (match) {
                    // Extract parts from the regex match
                    let [_, hour, minute, second, period] = match;
        
                    // Convert to numbers
                    hour = Number(hour);
                    minute = Number(minute);
                    second = Number(second);
        
                    if (!isNaN(hour) && !isNaN(minute) && !isNaN(second)) {
                        // Convert hour to 24-hour format based on AM/PM
                        if (period.toUpperCase() === 'PM' && hour !== 12) {
                            hour += 12;
                        } else if (period.toUpperCase() === 'AM' && hour === 12) {
                            hour = 0;
                        }
        
                        // Convert to total seconds since midnight
                        const messageTimeInSeconds = (hour * 3600) + (minute * 60) + second;
                       // return totalSeconds;
                       // Get the current system time and convert it to seconds
                        let currentTime = new Date();
                        let currentTimeInSeconds = (currentTime.getHours() * 3600) + (currentTime.getMinutes() * 60) + currentTime.getSeconds();
                    
                        // Calculate the time difference in seconds
                        let timeDifference = Math.abs(currentTimeInSeconds - messageTimeInSeconds);
                        return timeDifference;

                    } else {
                        throw new Error("Invalid time components in the timestamp.");
                    }
                } else {
                    throw new Error("Timestamp format is incorrect. Expected format: h:mm:ss AM/PM.");
                }
            } else {
                throw new Error("Timestamp must be a string.");
            }
        }
        

        //Live updates of SVG
        let svgMonitors = {}; // Store intervals and timestamps for multiple SVG elements

        function monitorSvgUpdate(timestamp, location) {
            const thirtyMinutesInSeconds = 30 * 60; // Convert 30 minutes to seconds
            const svgObject = document.getElementById("svg-object");
        
            let timeDifference = CalculateDifference(timestamp);
        
            // Check and update the SVG element
            function checkAndUpdateSvg() {
                if (timeDifference < thirtyMinutesInSeconds) {
                    // Within 30 minutes, apply red fill
                    updateSvgFill(location, "#FF0000");
                } else {
                    // After 30 minutes, revert to white fill
                    updateSvgFill(location, "#FFFFFF");
                    if (svgMonitors[location]) {
                        clearInterval(svgMonitors[location].intervalId); // Stop the interval once it exceeds 30 minutes
                        delete svgMonitors[location]; // Remove the monitor for this location
                    }
                }
            }
        
            // Update the SVG fill color
            function updateSvgFill(location, fillColor) {
                if (svgObject) {
                    if (svgObject.contentDocument) {
                        applyFill(svgObject.contentDocument, location, fillColor);
                    } else {
                        // In case the SVG is not loaded yet, listen for the load event
                        svgObject.addEventListener("load", function () {
                            applyFill(svgObject.contentDocument, location, fillColor);
                        });
                    }
                } else {
                    console.log("SVG object not found");
                }
            }
        
            // Apply the fill color to the specified path
            function applyFill(svgDoc, location, fillColor) {
                const pathElement = svgDoc.getElementById(location);
                if (pathElement) {
                    pathElement.setAttribute("fill", fillColor);
                } else {
                    console.log("No matching SVG path found for location", location);
                }
            }
        
            // Check immediately to ensure the correct color is applied
            checkAndUpdateSvg();
        
            // Start monitoring for this particular location
            const intervalId = setInterval(() => {
                timeDifference = CalculateDifference(timestamp); // Recalculate the time difference on every interval
                checkAndUpdateSvg();
            }, 1000);
        
            // Store the initial timestamp and interval ID for this location
            svgMonitors[location] = { timestamp, intervalId };
        }
        
        async function handleSend() {
            
            // Get the partition and sort key values from input fields
            let name = document.getElementById('nameValue').value;
            let number = document.getElementById('numberValue').value;
            let email = document.getElementById('emailValue').value;
            let message = document.getElementById('messageValue').value;

            if (!name || !number || !email || !message) {
                document.getElementById('sendresult').innerHTML = `<errorp>All fields are required.</errorp>`;
                return;
            }
          
            try {
                const response = await fetch('https://ngvw4trl11.execute-api.us-east-1.amazonaws.com/v1/contact', {
                  method: 'POST',
                  headers: {
                    'Content-Type': 'application/json',
                  },
                        // Formats the body with all the attributes
                        body: JSON.stringify({name, number,  email,  message }),
                });
            
                if (response.ok) {
                  document.getElementById('sendresult').innerHTML = `<p>Message sent successfully.</p>`;
                } else {
                  throw new Error(`HTTP error! Status: ${response.status}`);
                }
              } catch (error) {
                console.error(error);
                document.getElementById('sendresult').innerHTML = `<errorp>Failed to send message. Please try again.</errorp>`;
              }
            
          };
        
        
        
    