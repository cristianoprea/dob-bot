const { default: makeWASocket, useMultiFileAuthState } = require('@whiskeysockets/baileys')
const fs = require('fs')
const cron = require('node-cron')
const qrcode = require('qrcode-terminal')

require('dotenv').config()

const dataSource = JSON.parse(fs.readFileSync(process.env.DATA_SOURCE_FILE, 'utf8'))

var groupId = "";

async function startBot() {
  const { state, saveCreds } = await useMultiFileAuthState('./auth_info_baileys')

  const sock = makeWASocket({ auth: state })
  sock.ev.on('creds.update', saveCreds)

  sock.ev.on('connection.update', async (update) => {
    const { qr, connection } = update
    if (connection === "connecting" && qr) {
      qrcode.generate(qr, { small: true })
    }

    if (connection === 'open') {
      const groups = await sock.groupFetchAllParticipating();
      for (const [id, data] of Object.entries(groups)) {
        if (data.subject === process.env.GROUP_NAME) {
          groupId = id;
          console.log(`Group ID found: ${groupId}`);
          break;
        }
      }
    }

  })

  cron.schedule(process.env.RECCURRING_JOB, async () => {
    var today = new Date();
    var anniversaryPeople = dataSource.people.filter(p => IsDOB(p.id, today));

    if (anniversaryPeople.length > 0) {
      var peopleList = anniversaryPeople.map(p => `- ${p.name}`).join('\n');
      var message = process.env.MESSAGE_TEMPLATE.replace("{people}", peopleList)

      await sock.sendMessage(groupId, { text: message });

      console.log(`Sent message to group ${process.env.GROUP_NAME}: ${message}`);
    }

  })
}

function IsDOB(id, date) {
  const month = parseInt(id.slice(3, 5));
  const day = parseInt(id.slice(5, 7));

  const dobMonth = date.getMonth() + 1; // Months are zero-indexed
  const dobDay = date.getDate();

  return month === dobMonth && day === dobDay;
}

startBot()
