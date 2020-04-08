import { Vue, Component } from 'vue-property-decorator';

@Component
export default class DashboardAPI extends Vue{

    async getActionItems(){
        let data = await this.$ajax.get(`${process.env.SERVER_URL_HTTP}/dashboard/`);
        console.log(data);
        if(data.status == 200){
            return data.json().then(res => res.actionItems);
        }
        return [];
    }
    
}