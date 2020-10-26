let instance = new Vue({
    el: '#sales',
    data: {
        raid: 'nya', // use this to set default
        pricing_type: null,
        pricing_types : {},
        prices: {}
    },
    methods: {
        formatPrice(x) {
            if (typeof x === 'string') return x;
            else return x.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ",") + 'g';
        }
    },
    computed: {},
    mounted() {
        DynamicSuite.call('baddies-home', 'pricing_type.read', {}, response => {
            this.pricing_type = 1
            this.pricing_types = response.data;
        })
    },
    watch: {
        pricing_type() {
            if (this.pricing_type !== null) {
                DynamicSuite.call('baddies-home', 'pricing.read', {type_id: this.pricing_type}, response => {
                    this.prices = response.data;
                })
            }
        }
    }
});