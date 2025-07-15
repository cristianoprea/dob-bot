# dob-bot
WhatsApp Bot used to send anniversary message to the daily celebrants

Instructions:
1. RUN **npm install**
2. RUN **cp .env.dev .env**
3. Set the configurations parameters in the new **.env** file.
   
   GROUP_NAME="Family" (represents the name of the WhatsApp group) \
   MESSAGE_TEMPLATE="Happy birthay to our celebrants: {people}" \
   DATA_SOURCE_FILE="people.json" (represents the json file containing the data source) \
   RECCURRING_JOB="0 0 * * *" (every day at midnight)

   Note: please make use of **{people}** parameter in **MESSAGE_TEMPLATE** used to inject the people names in the message
   
4. Populate the json file set in **.env** following the next format: 
>{ 
>  "people": 
>  [ \
>    &nbsp;&nbsp;&nbsp;&nbsp;{ \
>      &nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;"name": "John Doe", \
>      &nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;"id": "5990909111122" \
>    &nbsp;&nbsp;&nbsp;&nbsp;} \
>  ]
>}

5. RUN **node index.js**
6. Scan the QR code using the WhatsApp on your phone by linking a new device
7. Based on the recurrence you set at the 3rd step, wait to see the magic 
