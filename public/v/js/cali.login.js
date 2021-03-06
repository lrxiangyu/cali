$(document).ready(function(){
    commonData();
    var app = new Vue({
        i18n,
        el: "#root",
        data: {
            loginName:"",
            loginPassword:""
        },
        methods: {
            login:function () {
                var form = commonData();
                form.append("loginName",this.loginName);
                form.append("loginPassword",this.loginPassword);
                fetch('/api/user/login',{method:'post',body:form}).then(function(response) {
                    if (response.redirected){
                        window.location.href = response.url;
                    }
                    return response.json();
                }).then(function(json) {
                    if (json.statusCode ==200){
                        store.set("session", json.info);
                        var form = commonData();
                        form.append("session",json.info);
                        fetch('/api/user/info',{method:'post',body:form}).then(function(response) {
                            return response.json()
                        }).then(function(user) {
                            if (user.statusCode ==200){
                                store.set("user", user.info);
                                store.set("session", json.info);
                                if(window.history.length >=2){
                                    window.history.go(-1);
                                }else {
                                    window.location = "/"
                                }
                            }else {
                                alert(user.message);
                            }
                        }).
                        catch(function(ex) {
                            console.log('parsing failed', ex)
                        });
                    }else {
                        alert(json.message);
                    }
                }).
                catch(function(ex) {
                    console.log('parsing failed', ex)
                });
            }
        },
        computed: {

        },
        created: function() {
            //console.log("created");
            if (!_.isUndefined(store.get("session")) && !_.isUndefined(store.get("user"))){
                window.location = "/"
            }
        },
        beforeMount: function () {
            //console.log("beforeMount");
        },
        mounted: function () {
            //console.log("mounted");
        }
    });
});