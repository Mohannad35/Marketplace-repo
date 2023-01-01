drop schema if exists marketplace;
create schema marketplace;
use marketplace;

create table user(uid int not null auto_increment, u_name varchar(40) not null,
login  varchar(60) unique not null,u_password varchar(20) not null
check(length(u_password) <= 20 and length(u_password) >= 8),
balance numeric(10,2) not null default 0, primary key(uid));

create table item(item_id int not null auto_increment,item_uid int, item_name varchar(40) not null, 
item_state varchar(5) check(item_state = "new" or
item_state = "sold"),
item_price numeric(10,2) not null default 0, created_date timestamp default current_timestamp,
sale_date timestamp,
primary key(item_id), purchased_by int,
foreign key(item_uid) references user(uid)
on delete set null on update cascade,
foreign key(purchased_by) references user(uid)
on delete set null on update cascade
);
/*
create table purchasedby(pitem_id int not null,
pitem_uid int not null, primary key(pitem_id),
foreign key(pitem_id) references item(item_id)
on delete cascade on update cascade, 
foreign key(pitem_uid) references user(uid)
on delete cascade on update cascade
);
*/
/*
insert into user(login,u_name,u_password) values("waleed.sa220@gmail.com","waleed","i will not say that");
insert into user(login,u_name,u_password) values("mohamedha@gmail.com","mohamed","mM4321HH");
insert into item(item_uid,item_name,purchased_by,item_state,item_price) values(1,"freska",2,"sold",2500);
select * from 
user,item
where  item_uid = uid;
*/