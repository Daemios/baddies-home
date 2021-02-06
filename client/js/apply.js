let instance = new Vue({
    el: '#application',
    data: {
        state: 0,
        token: null,
        checks: {
            percentiles: null,
            analysis: null,
            discord: null,
            all: null,
            app_received: null,
            app_sent: false
        },
        servers: {},
        options: {
            classes: {},
            specializations: {},
            gender: {
                'Male': 'Male',
                'Female': 'Female',
                'Non-binary': 'Non-binary'
            }
        },
        form: {
            player_name: {
                value: null,
                error: false
            },
            player_age: {
                value: null,
                error: false
            },
            player_gender: {
                value: null,
                error: false
            },
            battletag: {
                value: null,
                error: false
            },
            discord: {
                value: null,
                error: false
            },
            character: {
                value: null,
                error: false
            },
            server: {
                value: null,
                error: false
            },
            wow_class: {
                value: null,
                error: false
            },
            specialization: {
                value: null,
                error: false
            },
            current_progression: {
                value: null,
                error: false
            },
            trial_schedule: {
                value: null,
                error: false
            },
            raid_history: {
                value: null,
                error: false
            },
            last_two_guilds: {
                value: null,
                error: false
            },
            screenshot: {
                value: null,
                error: false
            },
            improve_resources: {
                value: null,
                error: false
            },
            log_analysis: {
                value: null,
                error: false
            },
            closing_notes: {
                value: null,
                error: false
            },
        }
    },
    methods: {
        // State methods
        stepToForm() {
            // Reset the page
            window.scrollTo(0, 0);

            this.state++;
        },
        stepToDiscordWarning() {
            // Reset the page
            window.scrollTo(0, 0);

            // Save the app
            this.saveApp();

            // Define validation state variable
            let advance = true;

            // Clear old errors
            Object.keys(this.form).forEach(key => {
                this.form[key].error = false;
            })

            // Validate fields aren't null
            for (const [key, value] of Object.entries(this.form)) {
                if (value.value === null) {
                    value.error = true;
                    advance = false;
                }
            }

            // Advance state
            if (advance) this.state++;
        },
        checkExternals() {
            // Reset the page
            window.scrollTo(0, 0);

            this.state = 3;

            this.getPercentiles();
            this.getAnalysis();
            this.checkUserOnServer();
        },
        backToQuestions() {
            // Reset the page
            window.scrollTo(0, 0);

            this.state = 2;
        },

        // Localmemory saving and loading
        loadApp() {

            // Iterate through questions in main vue object
            Object.keys(this.form).forEach(key => {

                if (window.localStorage.getItem(key) === 'null') {
                    this.form[key].value = null;
                } else {
                    // load name/value from local storage
                    this.form[key].value = window.localStorage.getItem(key);
                }

            })

        },
        saveQuestion(key) {

            // Save name/value to local storage
            window.localStorage.setItem(key, this.form[key].value);

        },
        saveApp() {

            // Iterate through questions in main vue object
            Object.keys(this.form).forEach(key => {
                this.saveQuestion(key);
            })

        },

        // Formatting for bot
        formatUrlServer(server) {
            return server
                .toLowerCase()
                .replace("'", "")
                .replace(" ", "-");
        },
        buildApp() {
            // Clear the currently added app
            this.app = [];

            // Generate initial app
            for (var i = 0; i < this.questions.length; i++) {
                // Filter the titles out
                if (this.questions[i].type != "title") {
                    // Add each element to app
                    this.app.push({
                        name: this.questions[i].title,
                        tag: this.questions[i].name,
                        value: this.questions[i].value
                    });
                }
            }
        },
        organizeApp() {
            // Reference objects
            let name = this.app.find(function (element) {
                return element.name === "Name";
            });

            let age = this.app.find(function (element) {
                return element.name === "Age";
            });

            let gender = this.app.find(function (element) {
                return element.name === "Gender";
            });

            // Build new string
            let nameAgeGender = name.value + " | " + age.value + " | " + gender.value;

            // Remove old
            this.app = this.app.filter(function (element) {
                if (element.name == name.name) {
                    return false;
                } else if (element.name == age.name) {
                    return false;
                } else if (element.name == gender.name) {
                    return false;
                } else {
                    return true;
                }
            });

            // Insert New Name | Age | Gender element into app object
            this.app.splice(0, 0, {
                name: "Name | Age | Gender",
                value: nameAgeGender
            });

            /*
             *
             * --- Combine battletag and discord ---
             *
             */

            // Reference objects
            let btag = this.app.find(function (element) {
                return element.name === "Battletag";
            });

            let discord = this.app.find(function (element) {
                return element.name === "Discord";
            });

            // Build new string
            let btagDiscord = btag.value + " | " + discord.value;

            // Remove old
            this.app = this.app.filter(function (element) {
                if (element.name == btag.name) {
                    return false;
                } else if (element.name == discord.name) {
                    return false;
                } else {
                    return true;
                }
            });

            // Insert New Battletag | Discord element into app object
            this.app.splice(1, 0, {
                name: "Battletag | Discord",
                value: btagDiscord
            });

            /*
             *
             * --- Cull scheduling issues title to short version ---
             *
             */

            // Reference objects
            let sched = this.app.find(function (element) {
                return element.tag === "timesIssues";
            });

            // Adjust name prop
            sched.name = "Potential Scheduling Issues";

            /*
             *
             * --- Build external links ---
             *
             */

            // Reference objects
            let main_name = this.app.find(function (element) {
                return element.tag === "mainName";
            });

            let main_server = this.app.find(function (element) {
                return element.tag === "mainServ";
            });

            // Adjust server for urls
            main_server = this.formatUrlServer(main_server)

            // Core URL strings
            let armory_str = "https://worldofwarcraft.com/en-us/character/";
            let wcl_str = "https://www.warcraftlogs.com/character/us/";
            let rio_str = "https://raider.io/characters/us/";

            // Build armory
            this.app.push({
                name: "Armory",
                value: "<" + armory_str + main_server.value + "/" + main_name.value + ">"
            });

            // Build WCL
            this.app.push({
                name: "Warcraft Logs",
                value: "<" + wcl_str + main_server.value + "/" + main_name.value + ">"
            });

            // Build Raider.io
            this.app.push({
                name: "Raider.io",
                value: "<" + rio_str + main_server.value + "/" + main_name.value + ">"
            });

            /*
             *
             * --- Move screenshot to bottom ---
             *
             */
            // Find screenshot object
            let screenshot = this.app.find(function (element) {
                return element.tag === "screenshot";
            });

            // Remove it from app array
            this.app = this.app.filter(function (element) {
                if (element.tag == screenshot.tag) {
                    return false;
                } else {
                    return true;
                }
            });

            // Insert It
            this.app.splice(this.app.length, 0, {
                name: "Screenshot",
                value: screenshot.value
            });
        },

        // API Stuff
        getWoWServers() {
            DynamicSuite.call('baddies-home', 'servers.get', {term: this.form.server.value}, response => {
                if (response.status === 'OK') {
                    console.log(response)
                    this.servers = response.data;
                } else {
                    console.log('Error retrieving servers')
                    console.log(response)
                }
            })
        },
        getWoWClasses() {
            DynamicSuite.call('baddies-insight', 'general:classes.read', {}, response => {
                if (response.status === 'OK') {
                    this.options.classes = response.data;
                } else {
                    console.log('Error retrieving classes')
                    console.log(response)
                }
            })
        },
        getWoWClassesSpec(wipe = false) {
            DynamicSuite.call('baddies-insight', 'general:specialization.read', {class_id: this.form.wow_class.value}, response => {
                if (response.status === 'OK') {
                    if (wipe) {
                        this.form.specialization.value = null;
                        this.saveQuestion('specialization');
                    }
                    this.options.specializations = response.data;
                } else {
                    console.log('Error retrieving specs')
                    console.log(response)
                }
            })
        },
        getWebToken() {
            fetch('https://baddies.org/discord/sendJWT')
                .then(data => {
                    return data.json();
                })
                .then((response) => {
                    this.token = response.token;
                })
                .catch(error => console.log(error))
        },
        getPercentiles() {
            setTimeout(() => {
                this.checks.percentiles = false;
            }, 1000);
        },
        getAnalysis() {
            setTimeout(() => {
                this.checks.analysis = false;
            }, 1500);
        },
        checkUserOnServer() {

            // Split value on #
            let discord_split = this.form.discord.value.split("#");

            // Set values to send to server
            let discord_name = discord_split[0];
            let discord_discriminator = discord_split[1];

            // Set counter
            let count = 0;

            let data = {
                discord_name: discord_name,
                discord_discriminator: discord_discriminator
            };

            // Checks server
            fetch('https://baddies.org/discord/checkUserOnServer', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                    Authorization: "Bearer " + this.token
                },
                body: JSON.stringify(data),
            })
                .then(response => response.json())
                .then(data => {
                    this.checks.discord = !!data.success;
                })
                .catch((error) => {
                    console.error('Error:', error);
                });

        },
        sendApp() {

            this.checks.app_sent = true;

            let channel_name =
                this.form.character.value.toLowerCase() +
                '-' +
                this.form.server.value
                    .toLowerCase()
                    .replace('-', '')
                    .replace('\'', '')

            let data = {
                discord_name: this.form.discord.value.split('#')[0],
                discord_discriminator: this.form.discord.value.split('#')[1],
                channel_name: channel_name,
                app_data: [
                    {
                        name: 'Name | Age | Gender',
                        value: this.form.player_name.value + ' | ' +
                            this.form.player_age.value + ' | ' +
                            this.form.player_gender.value
                    },
                    {
                        name: 'Battletag | Discord',
                        value: this.form.battletag.value + ' | ' +
                            this.form.discord.value
                    },
                    {
                        name: 'Character | Server',
                        value: this.form.character.value + ' | ' +
                            this.form.server.value
                    },
                    {
                        name: 'Specialization',
                        value: this.options.specializations[this.form.specialization.value] + ' ' +
                            this.options.classes[this.form.wow_class.value]
                    },
                    {
                        name: 'Current Progression',
                        value: this.form.current_progression.value
                    },
                    {
                        name: 'How long have you been raiding? What experience do you have with Mythic progression in the past?',
                        value: this.form.raid_history.value
                    },
                    {
                        name: 'List your last two guilds. Why did you leave and how long were you there?',
                        value: this.form.last_two_guilds.value
                    },
                    {
                        name: 'How do you improve yourself? What resources do you use?',
                        value: this.form.improve_resources.value
                    },
                    {
                        name: 'Link to a log from a progression kill of yours and tell us what you observe, in detail, good or bad. Some examples may include positioning, defensive use, cooldown management, and throughput, but may extend to anything else you think is relevant.',
                        value: this.form.log_analysis.value
                    },
                    {
                        name: 'Do you have any potential issues that could crop up during or shortly after your trial that would prevent you from showing up on time / attending raid?',
                        value: this.form.trial_schedule.value
                    },
                    {
                        name: 'Is there anything else you want us to know?',
                        value: this.form.closing_notes.value
                    },
                    {
                        name: 'Armory',
                        value: '<https://worldofwarcraft.com/en-us/character/us/' +
                            this.formatUrlServer(this.form.server.value) + '/' +
                            this.form.character.value + '>'
                    },
                    {
                        name: 'Warcraft Logs',
                        value: '<https://www.warcraftlogs.com/character/us/' +
                            this.formatUrlServer(this.form.server.value) + '/' +
                            this.form.character.value + '>'
                    },
                    {
                        name: 'Raider.io',
                        value: '<https://raider.io/characters/us/' +
                            this.formatUrlServer(this.form.server.value) + '/' +
                            this.form.character.value + '>'
                    },
                    {
                        name: 'Link to Screenshot in combat. Please be demonstrating your role i.e. healers be healing in a raid',
                        value: this.form.screenshot.value
                    }
                ]
            };

            // Checks server
            fetch('https://baddies.org/discord/receiveUserInfoFromApp', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                    Authorization: "Bearer " + this.token
                },
                body: JSON.stringify(data),
            })
                .then(response => response.json())
                .then(data => {
                    if (data.success) {
                        this.checks.app_received = true;
                        this.state++;
                    }
                })
                .catch((error) => {
                    console.error(error);
                });
        }
    },
    computed: {
        server_options() {
            let servers = [];

            Object.values(this.servers).forEach(server => {
                servers.push(server);
            })

            return servers;
        }
    },
    watch: {
        checks: {
            handler() {
                if (
                    this.checks.discord === true &&
                    this.checks.percentiles !== null &&
                    this.checks.analysis !== null
                ) {
                    setTimeout(() => {

                        this.checks.all = true;

                        if (!this.checks.app_sent) {
                            this.sendApp();
                        }

                    }, 2000)
                }
            },
            deep: true
        }
    },
    mounted() {

        // Get data from server for page
        this.getWoWClasses();

        // run this in the middle so you can wipe specs in Class() but reset to the saved value after wipe
        this.loadApp();
        this.getWoWClassesSpec();

        // Get data from bot
        this.getWebToken();
    }
});