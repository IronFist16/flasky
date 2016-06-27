from . import mail
from flask_mail import Message
from flask import current_app, render_template
from threading import Thread


def send_email(to, subject, template, **kwargs):
	app = current_app._get_current_object()
	msg = Message(app.config['FLASK_MAIL_SUBJECT_PREFIX'] + subject,
			sender=app.config['FLASK_MAIL_SENDER'], recipients=[to])
	msg.body = render_template(template + '.txt', **kwargs)
	msg.html = render_template(template + '.html', **kwargs)
	mail.send(msg)

def send_async_email_target(app, msg):
	with app.app_context():
		mail.send(msg)

def send_async_email(to, subject, template, **kwargs):
	app = current_app._get_current_object()
	msg = Message(app.config['FLASK_MAIL_SUBJECT_PREFIX'] + subject,
			sender=app.config['FLASK_MAIL_SENDER'],
			recipients = [to])
	msg.body = render_template(template + '.txt', **kwargs)
	msg.html = render_template(template + '.html', **kwargs)
	thr = Thread(target=send_async_email_target, args=[app, msg])
	thr.start()
	return thr