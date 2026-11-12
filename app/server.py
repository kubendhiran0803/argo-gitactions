import os
import time
import requests
from flask import Flask, request, jsonify, send_from_directory
from opentelemetry import trace
from opentelemetry.sdk.trace import TracerProvider
from opentelemetry.sdk.trace.export import BatchSpanProcessor
from opentelemetry.exporter.otlp.proto.http.trace_exporter import OTLPSpanExporter
from opentelemetry.sdk.resources import Resource
from opentelemetry.trace import Status, StatusCode

# ==============================================================================
# 1. OpenTelemetry Initialization & OTLP Exporter Configuration
# ==============================================================================
service_name = os.getenv("OTEL_SERVICE_NAME", "diwali-festive-microservice")
tempo_endpoint = os.getenv("OTEL_EXPORTER_OTLP_ENDPOINT", "http://tempo.monitoring.svc.cluster.local:4318")

resource = Resource.create({
    "service.name": service_name,
    "service.version": "1.0.0",
    "deployment.environment": "staging",
    "k8s.namespace.name": "sample-app",
    "app.framework": "Flask+OpenTelemetry"
})

provider = TracerProvider(resource=resource)
otlp_exporter = OTLPSpanExporter(endpoint=f"{tempo_endpoint}/v1/traces")
provider.add_span_processor(BatchSpanProcessor(otlp_exporter))
trace.set_tracer_provider(provider)
tracer = trace.get_tracer("diwali-microservices-hub", "1.0.0")

app = Flask(__name__, static_folder="src", static_url_path="")

# ==============================================================================
# 2. Microservice Layer (Code-Method Tracing with Parent & Child Spans)
# ==============================================================================

class AuthService:
    """Microservice: User Authentication & Letter-Count Countdown Algorithm"""
    @staticmethod
    def authenticate(username, password):
        with tracer.start_as_current_span("auth_service.authenticate") as span:
            span.set_attribute("service.name", "auth-service")
            span.set_attribute("user.username", username or "anonymous")
            
            # Sub-span: Calculate the tricky countdown rule based on letters
            with tracer.start_as_current_span("auth.calculate_tricky_rule") as rule_span:
                letters_only = ''.join(filter(str.isalpha, username or ''))
                length = len(letters_only) or 11
                p1 = f"{length:02d}"
                p2 = f"{max(length-1, 0):02d}"
                p3 = f"{max(length-2, 0):02d}"
                expected_password = f"{p1}{p2}{p3}"
                rule_span.set_attribute("auth.letter_count", length)
                rule_span.set_attribute("auth.expected_password", expected_password)
                time.sleep(0.015)
            
            # Sub-span: Verify input password against master key (111009) or rule
            with tracer.start_as_current_span("auth.verify_credentials") as verify_span:
                is_valid = (password == expected_password) or (password == "111009")
                verify_span.set_attribute("auth.is_valid", is_valid)
                if not is_valid:
                    span.set_status(Status(StatusCode.ERROR, "Invalid credentials provided"))
                time.sleep(0.01)
                
            return is_valid, expected_password

class CrackerService:
    """Microservice: Cracker Ignition, Pyrotechnic Simulation & Audio Synthesis"""
    @staticmethod
    def ignite(username, cracker_type="diwali-bomb"):
        with tracer.start_as_current_span("cracker_service.ignite") as span:
            span.set_attribute("service.name", "cracker-service")
            span.set_attribute("cracker.type", cracker_type)
            span.set_attribute("cracker.user", username or "anonymous")
            
            with tracer.start_as_current_span("cracker.simulate_fuse_burn") as fuse_span:
                fuse_span.set_attribute("fuse.duration_ms", 650)
                fuse_span.set_attribute("fuse.spark_intensity", "high")
                time.sleep(0.02)
                
            with tracer.start_as_current_span("cracker.synthesize_audio_harmonics") as audio_span:
                audio_span.set_attribute("audio.synth_engine", "WebAudio-SubBass")
                audio_span.set_attribute("audio.frequency_hz", 160)
                audio_span.set_attribute("audio.resonance_q", 4.0)
                time.sleep(0.015)
                
            with tracer.start_as_current_span("cracker.generate_firework_particles") as part_span:
                part_span.set_attribute("fireworks.particle_count", 160)
                part_span.set_attribute("fireworks.gravity", 0.12)
                part_span.set_attribute("fireworks.palette", "gold,crimson,violet,cyan")
                time.sleep(0.01)
                
            return {
                "status": "exploded",
                "cracker_type": cracker_type,
                "particles": 160,
                "timestamp": time.time()
            }

class GreetingService:
    """Microservice: Personalized Festive Blessing & Telemetry Provider"""
    @staticmethod
    def get_greeting(username):
        with tracer.start_as_current_span("greeting_service.get_greeting") as span:
            span.set_attribute("service.name", "greeting-service")
            span.set_attribute("greeting.recipient", username or "Guest")
            
            with tracer.start_as_current_span("greeting.compose_blessing") as comp_span:
                display_name = (username or "Guest").strip().title()
                headline = f"Happy Diwali, {display_name}!"
                blessing = "May the supreme light of Deepavali eradicate all darkness, illuminating your journey with boundless joy, vibrant health, prosperity, and triumphant career success!"
                comp_span.set_attribute("greeting.headline", headline)
                time.sleep(0.015)
                
            with tracer.start_as_current_span("telemetry.collect_system_metrics") as telem_span:
                telem_span.set_attribute("cluster.orchestrator", "Amazon EKS v1.30")
                telem_span.set_attribute("cluster.gitops", "ArgoCD App-of-Apps")
                telem_span.set_attribute("cluster.tracing", "OpenTelemetry + Grafana Tempo")
                time.sleep(0.01)
                
            return {
                "headline": headline,
                "blessing": blessing,
                "telemetry": {
                    "architecture": "Unified Microservices with Code-Method Tracing",
                    "orchestration": "Amazon EKS (v1.30)",
                    "cd": "ArgoCD (App-of-Apps)",
                    "tracing": "OpenTelemetry + Grafana Tempo (OTLP)"
                }
            }

# ==============================================================================
# 3. HTTP Endpoints
# ==============================================================================

@app.route("/")
def serve_index():
    with tracer.start_as_current_span("http.serve_index"):
        return send_from_directory("src", "index.html")

@app.route("/<path:path>")
def serve_static(path):
    return send_from_directory("src", path)

@app.route("/api/login", methods=["POST"])
def api_login():
    with tracer.start_as_current_span("api.login_handler") as span:
        data = request.get_json(silent=True) or {}
        username = data.get("username", "Guest")
        password = data.get("password", "")
        span.set_attribute("http.client_ip", request.remote_addr)
        
        is_valid, expected = AuthService.authenticate(username, password)
        if is_valid:
            return jsonify({"success": True, "user": username})
        return jsonify({"success": False, "error": f"Incorrect password! Expected: {expected}"}), 401

@app.route("/api/cracker/burst", methods=["POST"])
def api_cracker():
    with tracer.start_as_current_span("api.cracker_handler") as span:
        data = request.get_json(silent=True) or {}
        username = data.get("username", "Guest")
        cracker_type = data.get("type", "diwali-bomb")
        span.set_attribute("user.username", username)
        
        result = CrackerService.ignite(username, cracker_type)
        return jsonify(result)

@app.route("/api/greeting", methods=["GET"])
def api_greeting():
    with tracer.start_as_current_span("api.greeting_handler") as span:
        username = request.args.get("username", "Guest")
        span.set_attribute("user.username", username)
        
        result = GreetingService.get_greeting(username)
        return jsonify(result)

@app.route("/v1/traces", methods=["POST"])
def proxy_browser_traces():
    """Proxies frontend browser traces (from tracing.js) to Grafana Tempo OTLP receiver"""
    try:
        resp = requests.post(
            f"{tempo_endpoint}/v1/traces",
            data=request.get_data(),
            headers={"Content-Type": request.headers.get("Content-Type", "application/json")},
            timeout=4
        )
        return ("", resp.status_code)
    except Exception as e:
        return (str(e), 502)

@app.route("/healthz")
def healthz():
    return "OK", 200

@app.errorhandler(404)
def handle_404(e):
    with tracer.start_as_current_span("http.not_found") as span:
        span.set_attribute("http.status_code", 404)
        span.set_attribute("http.target", request.path)
        span.set_attribute("http.method", request.method)
        span.set_attribute("http.client_ip", request.remote_addr)
        span.set_status(Status(StatusCode.ERROR, f"404 Not Found: {request.path}"))
        return e.get_response()

if __name__ == "__main__":
    app.run(host="0.0.0.0", port=80)


# Trigger build 11/12/2026 11:10:27
