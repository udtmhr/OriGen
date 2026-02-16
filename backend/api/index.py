from main import app as application

# Vercel needs "app" variable for WSGI/ASGI entry point or "handler" for Serverless Function compatibility.
# In Vercel Python runtime, "app" variable is automatically detected if it's an ASGI app.
app = application
