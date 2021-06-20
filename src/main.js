import { createApp } from 'vue';
import { createRouter, createWebHistory } from 'vue-router';

import App from './App.vue';
import TeamsList from './components/teams/TeamsList.vue';
import UsersList from './components/users/UsersList.vue';
import TeamMembers from './components/teams/TeamMembers.vue';
import NotFound from './components/nav/NotFound.vue';
import UsersFooter from './components/users/UsersFooter.vue';
import TeamsFooter from './components/teams/TeamsFooter.vue';

//deklarasikan router
const router = createRouter({
    history:createWebHistory(),
    routes:[
        {path:'/',redirect:'/teams'},
        {
            name:'teams',
            path:'/teams',components:{default:TeamsList,footer:TeamsFooter}, 
            meta: {needsAuth:true},
            children:[
                {
                    name:'team-members',
                    path:':teamId',component:TeamMembers, props:true
                },
            ],
        },
        {
            path:'/users',components:{default:UsersList,footer:UsersFooter},
            beforeEnter(to,from,next){
                console.log('users beforeenter');
                console.log(to,from);
                next();
            },
        },
        {path:'/:notFound(.*)',component:NotFound},
    ],
    linkActiveClass:'active',
    scrollBehavior(_,_2,savedPosition){
        // console.log(to,from,savedPosition);
        if(savedPosition){
            return savedPosition;
        }
        return {left:0,top:0};
    },
});

router.beforeEach(function(to,from,next){
    console.log(to,from);
    if(to.meta.needsAuth){
        console.log('Needs auth!');
        next();
    }else{
        next();
    }

    //gunakan next(false); untuk menghentikan navigasi, misal karena User belum login atau belum menyelesaikan form
    //gunakan next(); untuk menampilkan route yang diminta
    //kita bisa mempassing object ke dalam next
    // if(to.name==='team-members'){
    //     next();
    // }else{
    //     next({name:'team-members',params:{teamId:'t2'}});
    // }
    next();
});

router.afterEach(function(to,from){
    //afterEach dipanggil setelah navigasi dilakukan
    //berguna untuk mengirim data analisis
    console.log('Global afterEach');
    console.log(to,from);
    
});

const app = createApp(App);

app.use(router);

app.mount('#app');
