#include <emscripten.h>
#include <math.h>
#include <stdlib.h>

// Particle structure
typedef struct {
    float x, y, z;        // position
    float vx, vy, vz;     // velocity
    float life;           // life remaining (0.0 to 1.0)
    float size;           // particle size
    float r, g, b, a;     // color
    float twinkle;        // twinkling phase
    float pulse_speed;    // individual pulse speed
    float brightness;     // brightness multiplier
} Particle;

// Global particle array
static Particle* particles = NULL;
static int particle_count = 0;
static int max_particles = 0;

// Initialize particle system
EMSCRIPTEN_KEEPALIVE
void init_particles(int count) {
    max_particles = count;
    particle_count = count;
    
    if (particles) {
        free(particles);
    }
    
    particles = (Particle*)malloc(sizeof(Particle) * count);
    
    // Initialize particles with random values
    for (int i = 0; i < count; i++) {
        particles[i].x = ((float)rand() / RAND_MAX - 0.5f) * 20.0f;
        particles[i].y = ((float)rand() / RAND_MAX - 0.5f) * 20.0f;
        particles[i].z = ((float)rand() / RAND_MAX - 0.5f) * 20.0f;
        
        particles[i].vx = ((float)rand() / RAND_MAX - 0.5f) * 2.0f;
        particles[i].vy = ((float)rand() / RAND_MAX - 0.5f) * 2.0f;
        particles[i].vz = ((float)rand() / RAND_MAX - 0.5f) * 2.0f;
        
        particles[i].life = 1.0f;
        particles[i].size = (float)rand() / RAND_MAX * 0.5f + 0.1f;
        
        particles[i].r = (float)rand() / RAND_MAX;
        particles[i].g = (float)rand() / RAND_MAX;
        particles[i].b = (float)rand() / RAND_MAX;
        particles[i].a = 1.0f;
        
        // Initialize twinkling effects
        particles[i].twinkle = (float)rand() / RAND_MAX * 6.28f; // Random phase
        particles[i].pulse_speed = 2.0f + (float)rand() / RAND_MAX * 3.0f; // 2-5 Hz
        particles[i].brightness = 0.5f + (float)rand() / RAND_MAX * 0.5f; // 0.5-1.0
    }
}

// Update particles physics
EMSCRIPTEN_KEEPALIVE
void update_particles(float delta_time, float gravity, float damping) {
    static float global_time = 0.0f;
    global_time += delta_time;
    
    for (int i = 0; i < particle_count; i++) {
        Particle* p = &particles[i];
        
        // Apply gravity
        p->vy -= gravity * delta_time;
        
        // Apply damping
        p->vx *= damping;
        p->vy *= damping;
        p->vz *= damping;
        
        // Update position
        p->x += p->vx * delta_time;
        p->y += p->vy * delta_time;
        p->z += p->vz * delta_time;
        
        // Update life
        p->life -= delta_time * 0.5f;
        
        // Update twinkling phase
        p->twinkle += p->pulse_speed * delta_time;
        if (p->twinkle > 6.28f) {
            p->twinkle -= 6.28f;
        }
        
        // Calculate twinkling effect (sine wave for smooth pulsing)
        float twinkle_factor = (sinf(p->twinkle) + 1.0f) * 0.5f; // 0.0 to 1.0
        
        // Add sparkle effect (random bright flashes)
        float sparkle = 0.0f;
        if ((rand() % 1000) < 3) { // 0.3% chance per frame
            sparkle = 2.0f; // Bright flash
        }
        
        // Combine effects
        float final_brightness = p->brightness * twinkle_factor + sparkle;
        if (final_brightness > 2.0f) final_brightness = 2.0f;
        
        // Update alpha based on life and twinkling
        p->a = p->life * final_brightness;
        
        // Reset particle if dead
        if (p->life <= 0.0f) {
            p->x = ((float)rand() / RAND_MAX - 0.5f) * 2.0f;
            p->y = 10.0f + (float)rand() / RAND_MAX * 2.0f;
            p->z = ((float)rand() / RAND_MAX - 0.5f) * 2.0f;
            
            p->vx = ((float)rand() / RAND_MAX - 0.5f) * 2.0f;
            p->vy = (float)rand() / RAND_MAX * 2.0f;
            p->vz = ((float)rand() / RAND_MAX - 0.5f) * 2.0f;
            
            p->life = 1.0f;
            p->a = 1.0f;
            
            // Reset twinkling parameters
            p->twinkle = (float)rand() / RAND_MAX * 6.28f;
            p->pulse_speed = 2.0f + (float)rand() / RAND_MAX * 3.0f;
            p->brightness = 0.5f + (float)rand() / RAND_MAX * 0.5f;
        }
    }
}

// Apply attraction to a point
EMSCRIPTEN_KEEPALIVE
void apply_attraction(float target_x, float target_y, float target_z, float strength) {
    for (int i = 0; i < particle_count; i++) {
        Particle* p = &particles[i];
        
        float dx = target_x - p->x;
        float dy = target_y - p->y;
        float dz = target_z - p->z;
        
        float distance = sqrtf(dx * dx + dy * dy + dz * dz);
        
        if (distance > 0.1f) {
            float force = strength / (distance * distance);
            
            p->vx += (dx / distance) * force;
            p->vy += (dy / distance) * force;
            p->vz += (dz / distance) * force;
        }
    }
}

// Get particle data pointer
EMSCRIPTEN_KEEPALIVE
Particle* get_particles() {
    return particles;
}

// Get particle count
EMSCRIPTEN_KEEPALIVE
int get_particle_count() {
    return particle_count;
}

// Cleanup
EMSCRIPTEN_KEEPALIVE
void cleanup_particles() {
    if (particles) {
        free(particles);
        particles = NULL;
    }
    particle_count = 0;
    max_particles = 0;
}