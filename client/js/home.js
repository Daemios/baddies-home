Vue.component('baddies-ranking', {
    template: `
    <div class="ranking">
        <span class="title">
            {{tier.name}}
        </span>     
        <span class="rank" :class="rarity_text(region_rank(tier.key))">
            {{region_rank(tier.key)}}
        </span>
        <span class="bosses">
            {{boss_kills(tier.key)}}
        </span>
    </div>
    `,
    props: {
        tier: {
            type: Object
        },
        progression: {
            type: Object
        }
    },
    methods: {
        prettyTierName(name) {
            return name.split('-')[0];
        },
        region_rank(name) {
            if (this.progression.ranks[name]) return this.progression.ranks[name].mythic.region
            return ''
        },
        boss_kills(name) {
            if (this.progression.progression[name]) return this.progression.progression[name].summary.split(" ").join("")
            return '';
        },
        rarity_text(rank) {

            if (rank <= 10) return 'text-legendary';
            if (rank > 10 && rank <= 100) return 'text-epic';
            else return 'text-rare';

        }
    }
});

Vue.component('baddies-progression', {
    template: `
    <div class="progress" v-cloak>
            
        <h2>Times</h2>
        
        
        <div class="schedule">
            <h4>Days</h4>
            <div class="days">Tuesday, Wednesday, and Thursday</div>
            <h4>Times</h4>
            <div class="times">8:00 - 11:00 CST</div>
        </div>
        
        <div class="current">
            <h2 class="boss-kills" v-if="progression">
                
            </h2>
            <div class="tier-name text-baddies">{{prettyTierName("nya'lotha-the-waking-city")}}</div>
            <h2 class="current-rank" v-if="progression.progression">
                <span class="faux-break"></span>
                US {{region_rank('nyalotha-the-waking-city')}} | {{boss_kills('nyalotha-the-waking-city')}}
            </h2>
        </div>
        
        <div class="extended">
        
            <div class="ranking">
                <h4 class="title">Raid</h4>
                <h4 class="rank">Rank</h4>
                <h4 class="bosses">Kills</h4>
            </div>
            
            <baddies-ranking 
                v-for="tier in tiers" 
                :key="tier.key" 
                :tier="tier" 
                :progression="progression"
            ></baddies-ranking>
            
            <div class="other-tiers">
                <a href="https://www.wowprogress.com/guild/us/stormreaver/Baddies">
                    Browse all tiers since Cataclysm
                </a>
            </div>
        
        </div>

    </div>`,
    props: {
        // What information to display (current tier vs current + previous)
        type: {
            type: String,
            validator(value) {
                return [
                    'short',
                    'long'
                ].indexOf(value) !== -1;
            }
        }
    },
    data() {
        return {
            tiers: [
                {
                    name: 'Eternal Palace',
                    key: 'the-eternal-palace'
                },
                {
                    name: 'Battle of Dazar\'alor',
                    key: 'battle-of-dazaralor'
                }
            ],
            progression: {
                progression: {},
                ranks: {}
            }
        }
    },
    methods: {
        getCurrentProgression() {

            DynamicSuite.call('baddies-home', 'progression.get', {}, response => {

                this.progression = response.data;

            })

        },
        prettyTierName(name) {
            return name.split('-')[0];
        },
        tierList() {
            return Object.keys(this.progression.progression)
        },
        region_rank(name) {
            if (this.progression.ranks[name]) return this.progression.ranks[name].mythic.region
            return 'Loading'
        },
        boss_kills(name) {
            if (this.progression.progression[name]) return this.progression.progression[name].summary.split(" ").join("")
            return 'Loading';
        }
    },
    mounted() {
        this.getCurrentProgression();
    }
});

let instance = new Vue({
    el: '#home'
});