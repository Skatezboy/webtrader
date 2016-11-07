define(["lodash","jquery","moment","windows/windows","common/rivetsExtra","websockets/binary_websockets","charts/chartingRequestMap","text!trade/tradeDialog.html","css!trade/tradeDialog.css","timepicker","jquery-ui","common/util"],function(a,b,c,d,e,f,g,h){function i(b){return a(b).filter({contract_category_display:"Up/Down",barrier_category:"euro_atm",contract_display:"higher"}).each(m("contract_display","rise")),a(b).filter({contract_category_display:"Up/Down",barrier_category:"euro_atm",contract_display:"lower"}).each(m("contract_display","fall")),a(b).filter(["contract_category_display","Stays In/Goes Out"]).each(m("contract_category_display","In/Out")),a(b).filter(["contract_category_display","Ends In/Out"]).each(m("contract_category_display","In/Out")),a(b).filter(["contract_category_display","Digits"]).each(m("barriers",0)),a(b).filter(["contract_display","ends outside"]).each(m("contract_display","ends out")),a(b).filter(["contract_display","ends between"]).each(m("contract_display","ends in")),a(b).filter(["contract_display","stays between"]).each(m("contract_display","stays in")),a(b).filter(["contract_display","goes outside"]).each(m("contract_display","goes out")),a(b).filter(["contract_display","touches"]).each(m("contract_display","touch")),a(b).filter(["contract_display","does not touch"]).each(m("contract_display","no touch")),b=a.sortBy(b,function(a){var b={"Up/Down":1,"Touch/No Touch":2,"In/Out":3,Digits:4,Asians:5,Spreads:6}[a.contract_category_display];return 4===b&&(b={odd:4,even:4.5}[a.contract_display]||3.5),b})}function j(a,b){return f.cached.send({trading_times:a}).then(function(a){var c={open:"--",close:"--"};return a.trading_times.markets.forEach(function(a){a.submarkets.forEach(function(a){a.symbols.forEach(function(a){a.symbol===b&&(c={open:a.times.open[0],close:a.times.close[0]})})})}),c})["catch"](function(a){return{open:"--",close:"--"}})}function k(d,e,g,h,i){var k={duration:{array:["Duration","End Time"],value:"Duration"},duration_unit:{array:[""],ranges:[{min:1,max:365}],value:""},duration_count:{value:1,min:1,max:365},date_start:{value:"now",array:[{text:"Now",value:"now"}],visible:!1},date_expiry:{value_date:c.utc().format("YYYY-MM-DD"),value_hour:c.utc().format("HH:mm"),value:0,today_times:{open:"--",close:"--",disabled:!1},onHourShow:function(a){var b=k.date_expiry.today_times;if("--"===b.open)return!0;var d=c.utc(),e=c(b.close,"HH:mm:ss").hour(),f=c(b.open,"HH:mm:ss").hour();return d.hour()>=f&&d.hour()<=e&&(f=d.hour()),a>=f&&e>=a||e>=a&&f>=e||a>=f&&f>=e},onMinuteShow:function(a,b){var d=k.date_expiry.today_times;if("--"===d.open)return!0;var e=c.utc(),f=c(d.close,"HH:mm:ss").hour(),g=c(d.close,"HH:mm:ss").minute(),h=c(d.open,"HH:mm:ss").hour(),i=c(d.open,"HH:mm:ss").minute();return e.hour()>=h&&e.hour()<=f&&(h=e.hour(),i=e.minute()),h===a?b>=i:f===a?g>=b:a>h&&f>a||f>a||a>h}},categories:{array:[],value:"",paddingTop:function(){var a={Asians:"26px","Up/Down":"8px",Digits:"14px","In/Out":"4px","Touch/No Touch":"16px",Spreads:"5px"};return a[k.categories.value]||"3px"}},category_displays:{array:[],selected:""},barriers:{barrier_count:0,barrier:"",high_barrier:"",low_barrier:"",barrier_live:function(){return 1*this.barrier+1*k.tick.quote},high_barrier_live:function(){return 1*this.high_barrier+1*k.tick.quote},low_barrier_live:function(){return 1*this.low_barrier+1*k.tick.quote}},digits:{array:["0","1","2","3","4","5","6","7","8","9"],value:"0",visible:!1,text:"Last Digit Prediction".i18n()},currency:{array:["USD"],value:"USD"},basis:{array:["Payout","Stake"],value:"payout",amount:10,limit:null},spreads:{amount_per_point:1,stop_type:"point",stop_loss:(a.find(d,"stop_loss")||{stop_loss:10}).stop_loss,stop_profit:(a.find(d,"stop_profit")||{stop_profit:10}).stop_profit,spread:0,spot:"0.0",spot_time:"0",deposit_:function(){return"point"===this.stop_type?this.stop_loss*this.amount_per_point:this.stop_loss}},tick:{epoch:"0",quote:i,perv_quote:"0",down:function(){var a=1*this.quote<1*this.perv_quote;return a}},ticks:{array:[],loading:!0},proposal:{symbol:h.symbol,symbol_name:h.display_name,last_promise:null,id:"",ask_price:"0.0",date_start:0,display_value:"0.0",message:"Loading ...".i18n(),payout:0,spot:"0.0",spot_time:"0",error:"",loading:!0,netprofit_:function(){return formatPrice((this.payout-this.ask_price||0).toFixed(2),k.currency.value)},return_:function(){var a=(this.payout-this.ask_price)/this.ask_price*100;return a=a&&a.toFixed(1)||0,a+"%"}},purchase:{loading:!1},tooltips:{barrier:{my:"left-215 top+10",at:"left bottom",collision:"flipfit"},barrier_p:{my:"left-5 top+10",at:"left bottom",collision:"flipfit"}}};k.barriers.root=k,k.date_expiry.update_times=function(){j(k.date_expiry.value_date,k.proposal.symbol).then(function(b){var d=k.date_expiry;d.today_times.open=b.open,d.today_times.close=b.close;var e=a(k.duration_unit.ranges).filter(["type","minutes"]).head();d.today_times.disabled=!e;var f=e?c.utc().add(e.min+1,"m").format("HH:mm"):"00:00";d.value_hour=f>d.value_hour?f:d.value_hour})},k.categories.update=function(){var b=k.categories.value;k.category_displays.array=a(d).filter(["contract_category_display",b]).map("contract_display").uniq().value(),k.category_displays.selected=a.head(k.category_displays.array)},k.category_displays.onclick=function(a){k.category_displays.selected=b(a.target).attr("data")},k.date_start.update=function(){var b=a(d).filter({contract_category_display:k.categories.value,contract_display:k.category_displays.selected,start_type:"forward"}).head(),c=a(d).filter({contract_category_display:k.categories.value,contract_display:k.category_displays.selected,start_type:"spot"}).head();if(!b)return void a.assign(k.date_start,{visible:!1,array:[],value:"now"});b=b.forward_starting_options;var e=(k.date_start,[]);c&&(e=[{text:"Now",value:"now"}]);var f=((new Date).getTime()+3e5)/1e3;a.each(b,function(a){for(var b=300,c=Math.ceil(Math.max(f,a.open)/b)*b,d=c;d<a.close;d+=b){var g=new Date(1e3*d),h=("00"+g.getUTCHours()).slice(-2)+":"+("00"+g.getUTCMinutes()).slice(-2)+" "+["Sun","Mon","Tue","Wed","Thu","Fri","Sat"][g.getUTCDay()];e.push({text:h,value:d})}});var g={value:e[0].value,array:e,visible:!0};a.some(e,{value:1*k.date_start.value})&&(g.value=k.date_start.value),a.assign(k.date_start,g)},k.date_expiry.update=function(a){var b=k.date_expiry,d=!c.utc(b.value_date).isAfter(c.utc(),"day");d?(a!==b.value_hour&&b.update_times(),b.value=c.utc(b.value_date+" "+b.value_hour).unix(),n(b.value,k.proposal.onchange)):(b.today_times.disabled=!0,j(b.value_date,k.proposal.symbol).then(function(a){var d="--"!==a.close?a.close:"00:00:00";b.value_hour=c(d,"HH:mm:ss").format("HH:mm"),b.value=c.utc(b.value_date+" "+d).unix(),n(b.value,k.proposal.onchange)}))},k.duration.update=function(){var b=k.categories.value;a(["Up/Down","In/Out","Touch/No Touch"]).includes(b)?2!==k.duration.array.length&&(k.duration.array=["Duration","End Time"]):(k.duration.value="Duration",1!==k.duration.array.length&&(k.duration.array=["Duration"]))},k.duration_unit.update=function(){var b="now"!==k.date_start.value?"forward":"spot",c=a(d).filter({contract_category_display:k.categories.value,contract_display:k.category_displays.selected,start_type:b}).map(function(a){return{min:a.min_contract_duration+"",max:a.max_contract_duration+"",type:a.expiry_type}}).value(),e=[],f=[];a.each(c,function(b){if(a(["tick","daily"]).includes(b.type))return e.push({tick:"ticks",daily:"days"}[b.type]),void f.push({min:0|b.min.replace("d","").replace("t",""),max:0|b.max.replace("d","").replace("t",""),type:{tick:"ticks",daily:"days"}[b.type]});var c=b.min.replace("s","").replace("m","").replace("h",""),d=b.max.replace("s","").replace("m","").replace("h","").replace("d",""),g=a(b.min).last(),h=a(b.max).last();c*={s:1,m:60,h:3600}[g],d*={s:1,m:60,h:3600,d:86400}[h],"s"===g&&(e.push("seconds"),f.push({min:c,max:d,type:"seconds"})),a(["s","m"]).includes(g)&&d>=60&&(e.push("minutes"),f.push({min:Math.max(c/60,1),max:d/60,type:"minutes"})),a(["s","m","h"]).includes(g)&&d>=3600&&(e.push("hours"),f.push({min:Math.max(c/3600,1),max:d/3600,type:"hours"}))});var g={ticks:0,seconds:1,minutes:2,hours:3,days:4};return e.sort(function(a,b){return g[a]-g[b]}),f.sort(function(a,b){return g[a.type]-g[b.type]}),e.length?(k.duration_unit.ranges=f,a.includes(e,k.duration_unit.value)?k.duration_count.update(!0):k.duration_unit.value=a.head(e),k.duration_unit.array=e,k.barriers.update(),void k.date_expiry.update_times()):void k.barriers.update()},k.duration_count.update=function(b){var c=a(k.duration_unit.ranges).filter({type:k.duration_unit.value}).head();c&&(k.duration_count.min=c.min,k.duration_count.max=c.max,b!==!0?k.duration_count.value=c.min:(k.duration_count.value<c.min||k.duration_count.value>c.max)&&(k.duration_count.value=c.min))},k.digits.update=function(){var b=k.category_displays.selected;if("Digits"!==k.categories.value||"odd"===b||"even"===b)return void(k.digits.visible=!1);var c={matches:["0","1","2","3","4","5","6","7","8","9"],differs:["0","1","2","3","4","5","6","7","8","9"],under:["1","2","3","4","5","6","7","8","9"],over:["0","1","2","3","4","5","6","7","8"]}[b],d={matches:"Last Digit Prediction".i18n(),differs:"Last Digit Prediction".i18n(),under:"Last Digit is Under".i18n(),over:"Last Digit is Over".i18n()}[b];a.includes(c,k.digits.value)||(k.digits.value=c[0]),k.digits.array=c,k.digits.text=d,k.digits.visible=!0},k.barriers.update=function(){var b=k.duration_unit.value,c=a(["seconds","minutes","hours"]).includes(b)?"intraday":"days"===b?"daily":"tick",e=a(d).filter({contract_category_display:k.categories.value,contract_display:k.category_displays.selected,expiry_type:c}).filter(function(a){return a.barriers>=1}).head();if(k.barriers.barrier_count=e?e.barriers:0,e){if(e.barrier){var f=1*(k.barriers.barrier||e.barrier);k.barriers.barrier=(f>=0?"+":"")+f}if(e.high_barrier){var g=1*(k.barriers.high_barrier||e.high_barrier);k.barriers.high_barrier=(g>=0?"+":"")+g}if(e.low_barrier){var h=1*(k.barriers.low_barrier||e.low_barrier);k.barriers.low_barrier=(h>=0?"-":"")+h}}},k.basis.update_limit=function(){var b=k.basis,c=a(d).filter({contract_category_display:k.categories.value,contract_display:k.category_displays.selected}).head();c=c&&c.payout_limit||null,b.limit=c?1*c:null,b.limit&&(b.amount=Math.min(b.amount,b.limit))},k.proposal.onchange=function(){var b=k.duration_unit.value,c=a(["seconds","minutes","hours"]).includes(b)?"intraday":"days"===b?"daily":"tick";"Spreads"===k.categories.value&&(c="intraday");var e=a(d).filter({contract_category_display:k.categories.value,contract_display:k.category_displays.selected,expiry_type:c}).head(),g={proposal:1,subscribe:1,contract_type:e.contract_type,currency:k.currency.value,symbol:k.proposal.symbol};if("Spreads"!==k.categories.value?(g.amount=1*k.basis.amount,g.basis=k.basis.value):(g.amount_per_point=k.spreads.amount_per_point,g.stop_type=k.spreads.stop_type,g.stop_loss=k.spreads.stop_loss,g.stop_profit=k.spreads.stop_profit),1==k.barriers.barrier_count&&(g.barrier=k.barriers.barrier),2==k.barriers.barrier_count&&(g.barrier=k.barriers.high_barrier,g.barrier2=k.barriers.low_barrier+""),"Digits"===k.categories.value&&(g.barrier=k.digits.value+""),"now"!==k.date_start.value&&(g.date_start=1*k.date_start.value),"Duration"===k.duration.value){if(g.duration_unit=a(k.duration_unit.value).head(),k.duration_count.value<1)return void(k.duration_count.value=1);g.duration=1*k.duration_count.value}else g.date_expiry=k.date_expiry.value;k.proposal.loading=!0,k.proposal.last_promise&&k.proposal.last_promise.then(function(a){var b=a&&a.proposal&&a.proposal.id;b&&f.send({forget:b})});var h=f.send(g).then(function(a){if(h===k.proposal.last_promise){var b=a.proposal&&a.proposal.id;k.proposal.error="",k.proposal.id=b}return a})["catch"](function(a){return k.proposal.error=a.message,k.proposal.message="",a.echo_req&&a.echo_req.proposal&&a.details&&(k.proposal.ask_price=a.details.display_value,k.proposal.message=a.details.longcode),a});k.proposal.last_promise=h,k.proposal.id=""},k.purchase.onclick=function(){k.purchase.loading=!0;var c=function(a){a.appendTo(e),e.find(".trade-fields").css({left:"350px"}),e.find(".trade-conf").css({left:"0"})},d=function(a){e.find(".trade-fields").css({left:"0"}),e.find(".trade-conf").css({left:"-350px"}),k.purchase.loading=!1,a.remove(),k.proposal.onchange()},g={currency:k.currency.value,symbol:k.proposal.symbol,symbol_name:k.proposal.symbol_name,category:k.categories.value,category_display:k.category_displays.selected,duration_unit:k.duration_unit.value,pip:h.pip};g.show_tick_chart=!1,a(["Digits","Up/Down","Asians"]).includes(g.category)&&"Duration"===k.duration.value&&"ticks"===g.duration_unit&&(g.digits_value=k.digits.value,g.tick_count=1*k.duration_count.value,"Digits"!==g.category&&("Asians"!==g.category&&(g.tick_count+=1),"Up/Down"===g.category&&a(["higher","lower"]).includes(g.category_display)&&(g.barrier=k.barriers.barrier),g.show_tick_chart=!0)),f.is_authenticated()?require(["trade/tradeConf"],function(a){f.send({buy:k.proposal.id,price:1*k.proposal.ask_price}).then(function(b){g.contract_id=b.buy.contract_id,g.transaction_id=b.buy.transaction_id,(g.show_tick_chart||"Digits"===g.category)&&f.proposal_open_contract.subscribe(g.contract_id),a.init(b,g,c,d,h)})["catch"](function(a){k.purchase.loading=!1,b.growl.error({message:a.message}),"InvalidToken"===a.code?f.invalidate():k.proposal.onchange()})}):(b.growl.warning({message:"Please log in".i18n()}),k.purchase.loading=!1)},k.categories.array=a(d).map("contract_category_display").uniq().value(),k.categories.value=a(k.categories.array).includes("Up/Down")?"Up/Down":a(k.categories.array).head();var l=!1;return f.events.on("tick",function(a){a.tick&&a.tick.symbol==k.proposal.symbol&&(l=!0,k.tick.perv_quote=k.tick.quote,k.tick.epoch=a.tick.epoch,k.tick.quote=a.tick.quote,k.ticks.loading=!1,k.ticks.array.length>30&&k.ticks.array.shift(),k.ticks.array.push(a.tick))}),f.events.on("proposal",function(b){a.defer(function(){if(b.proposal&&b.proposal.id===k.proposal.id){if(b.error)return k.proposal.error=b.error.message,void(k.proposal.message="");if(!k.purchase.loading){var a=b.proposal;k.proposal.ask_price=a.ask_price,k.proposal.date_start=a.date_start,k.proposal.display_value=a.display_value,k.proposal.message=a.longcode,k.proposal.payout=a.payout,k.proposal.spot=a.spot,k.proposal.spot_time=a.spot_time,k.spreads.spread=a.spread||0,k.spreads.spot=a.spot||"0.0",k.spreads.spot_time=a.spot_time||"0",k.proposal.loading=!1,!l&&a.spot&&(k.tick.epoch=a.spot_time,k.tick.quote=a.spot)}}})}),f.is_authenticated()&&f.send({payout_currencies:1}).then(function(a){k.currency.value=a.payout_currencies[0],k.currency.array=a.payout_currencies})["catch"](function(a){}),k}function l(c,j){var l=b(h).i18n(),m=i(j.available),n=d.createBlankWindow(l,{title:c.display_name,resizable:!1,collapsable:!1,minimizable:!0,maximizable:!1,"data-authorized":"true",close:function(){q.proposal.last_promise&&q.proposal.last_promise.then(function(a){var b=a.proposal&&a.proposal.id;b&&f.send({forget:b})}),g.unregister(o),r.unbind(),n.destroy()}});n.track({module_id:"tradeDialog",is_unique:!1,data:c});var o=g.keyFor(c.symbol,0),p=a(m).map("min_contract_duration").some(function(b){return/^\d+$/.test(b)||"t"===a.last(b)});g[o]?g.subscribe(o):g.register({symbol:c.symbol,subscribe:1,granularity:0,count:1e3,style:"ticks"})["catch"](function(c){p&&(b.growl.error({message:c.message}),a.delay(function(){n.dialog("close")},2e3))});var q=k(m,l,n,c,j.spot);p||(q.ticks.loading=!1);var r=e.bind(l[0],q);q.categories.update(),n.dialog("open")}require(["trade/tradeConf"]);var m=function(a,b){return function(c){return c[a]=b,c}},n=e.formatters.debounce;return{init:l}});