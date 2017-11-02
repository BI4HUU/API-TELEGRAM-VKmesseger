const tokenVK = '88888888888888888888888888888888888888888888888888888888';
const tokenT = '8888888888888888888888888888';
const vkapi = new (require('node-vkapi'))({ accessToken: `${tokenVK}`});
const TelegramBot = require('node-telegram-bot-api');
const bot = new TelegramBot(tokenT, {polling: true});
let arr = [],sarr = [],arrNew = [],sArrNew = [],arrHistory = [],body,chatId = '********',ID = "********";// мой id  вк
bot.on('message', (msg) => { // получаем текст од бота Телеграм
	chatId = msg.chat.id;
	if (chatId == '*********') {// id чата телеграм
		if (msg.text==`f`) { // Загружает список друзей выбраного пользователя
            vkapi.call('friends.search', {user_id: `${ID}`, message: `${msg.text}`, count: `333`}).then( body => {//
                    for (var i = 0; i < body.items.length; i++ ) {
                            sarr = [];
                            sarr = [{ text: `${body.items[i].first_name} ${body.items[i].last_name}`, callback_data: `${body.items[i].id}` }];
                            arr.unshift(sarr)
                    }
                    if (arr.length > 88) {
                        sendAllFriends()
                        function sendAllFriends() {
                            arrSplice = arr.splice(0, 88)
                            bot.sendMessage(chatId, "All Friends", {reply_markup: {	inline_keyboard: arrSplice}});
                            setTimeout(function() {
                                if(arr.length>0){sendAllFriends()};
                            }, 200);
                        }
                    } else {
                        bot.sendMessage(chatId, "All Friends", {reply_markup: {	inline_keyboard: arr}});arr = [[{ text: '********* ******', callback_data: '88888888' }]];
                    }
            });
		}
		else {if (msg.text==`h`) { // история переписки выбраного пользователя
			vkapi.call('messages.getHistory', {user_id: `${ID}`, count: `8`}).then( body3 => {
				itemsH = body3.items; 
				for (var i = 0;i < itemsH.length; i++ ) { 
						arrHistory.unshift([{ text: `${body3.items[i].body}`, callback_data: `test1` }])
				}
				bot.sendMessage(chatId, "History Messeg", {reply_markup: {	inline_keyboard: arrHistory}});arrHistory = [];
			});
		}
		else {if (msg.text==`/start`) {} // ничево
		else {if (msg.text==`r`) {ID = "*******";}// збрасуем пользователя на себя
		else {if (msg.text==`b`) { // список топоввх дркзей
			arr = [[{ text: '**** ******', callback_data: '*******' }],[{ text: '***** *****', callback_data: '******' }]];
			bot.sendMessage(chatId, "Super Friends", {reply_markup: {	inline_keyboard: arr}});arr = [[{ text: '********* ******', callback_data: '88888888' }]];
		} 
		else { // иначе одправляем сообщения
			vkapi.call('messages.send', {
				user_id:   `${ID}`,
				message:  `${msg.text}`
			}).then(users => {});
		}
		}
		}
		}
		}
	}
});
bot.on('callback_query', function (msg) {
	ID = msg.data;
	vkapi.call('messages.markAsRead', {
		peer_id: `${ID}`
	});
});
setInterval(() =>{ // Опрашуем ВК на сообщения
	vkapi.call('messages.get', {
		count:   '8'
	}).then(users => {
		for (var i = 0; i < users.items.length; i++ ) {
			sArrNew = [{ user_id: `${users.items[i].user_id}`, body: `${users.items[i].body}` }];
			if (users.items[i].read_state == 0) { // Одфильтровуем Новые сообщения 
				arrNew.unshift(sArrNew)
			}
		}
		sendAllFriends2()
			function sendAllFriends2() {
				if (arrNew.length >= 1) {
					arrSpliceNew = arrNew.splice(0, 1)
					if (arrSpliceNew[0][0]) {
						vkapi.call('users.get', { // запрашуем имя для id
							user_ids: `${arrSpliceNew[0][0].user_id}`
						}).then(users => {
							sArrNew2 = [{ text: `${users[0].first_name} ${users[0].last_name} ${arrSpliceNew[0][0].body}`, callback_data: `${arrSpliceNew[0][0].user_id}` }];
							bot.sendMessage(chatId, "NEW MESSEG", {reply_markup: {	inline_keyboard: [sArrNew2]}});// Одпраляем новое смс в Телеграм
						})
					}
				}
				setTimeout(function() {
					if(arrNew.length > 0){sendAllFriends2()};
				}, 8000);
			}
	})
}, 600000);