# node-files-bull-redis-nodemailer


## O que é o projeto? e para que serve?

### O projeto basicamente mostra uma forma de usar um microservico "pasta Lua" que se comunica com a "pasta Terra(servidor principal)", que faz as chamadas para a lua , e nela utilizamos algumas ferramentas de fila , e armazenamento em momoria, o armazenamento em memoria é chamado para que os dados recebidos da "terra" entrem primeiro no banco e depois no armazenamento em cache, mas isso sem perder a latência, porque se algo der errado no banco ele nao colocara no cache. Ambas lua e saturno possuem metodos de GET e POST, o metodo GET da lua é mais eficiente pois armazena os dados em memoria e traz com mais velocidade, ja saturno ele faz a chamada no banco e retorna GET mas com uma velocidade menor que a da lua. Em resumo o uso de microservicos na maioria dos casos , que envolva muita requisicão é interessante polo-as em um lugar separado para ser tratada e deixar a requisicao livre para o fluxo sem interrupção ou espera.


### O projeto ele serve para mostrar uma forma de reduzir as latências de chamadas que envolvam um serto tempo para serem executadas, por isso utilizei filas e redis.
