const canvas = document.getElementById('gameCanvas');
const ctx = canvas.getContext('2d');
const ballImage = document.getElementById('ballImage');

// Add image loading verification
ballImage.onload = () => {
    console.log('Ball image loaded successfully');
};

ballImage.onerror = () => {
    console.error('Failed to load ball image');
};

// Game objects
const ball = {
    x: canvas.width / 2,
    y: canvas.height / 2,
    radius: 40,
    speed: 2,
    dx: 2,
    dy: 2
};

const paddleHeight = 100;
const paddleWidth = 10;

const player = {
    x: 0,
    y: canvas.height / 2 - paddleHeight / 2,
    width: paddleWidth,
    height: paddleHeight,
    dy: 0,
    speed: 8
};

const computer = {
    x: canvas.width - paddleWidth,
    y: canvas.height / 2 - paddleHeight / 2,
    width: paddleWidth,
    height: paddleHeight,
    dy: 0,
    speed: 6
};

// Score
let playerScore = 0;
let computerScore = 0;

// Controls
const keys = {
    up: false,
    down: false
};

// Event listeners
document.addEventListener('keydown', (e) => {
    if (e.key === 'ArrowUp') keys.up = true;
    if (e.key === 'ArrowDown') keys.down = true;
});

document.addEventListener('keyup', (e) => {
    if (e.key === 'ArrowUp') keys.up = false;
    if (e.key === 'ArrowDown') keys.down = false;
});

// Game functions
function movePaddles() {
    // Player paddle movement
    if (keys.up && player.y > 0) {
        player.y -= player.speed;
    }
    if (keys.down && player.y + player.height < canvas.height) {
        player.y += player.speed;
    }

    // Computer AI
    const computerCenter = computer.y + computer.height / 2;
    if (computerCenter < ball.y - 35) {
        computer.y += computer.speed;
    } else if (computerCenter > ball.y + 35) {
        computer.y -= computer.speed;
    }
}

function moveBall() {
    ball.x += ball.dx;
    ball.y += ball.dy;

    // Top and bottom collision
    if (ball.y + ball.radius > canvas.height || ball.y - ball.radius < 0) {
        ball.dy *= -1;
    }

    // Paddle collision
    if (ball.x - ball.radius < player.x + player.width &&
        ball.y > player.y &&
        ball.y < player.y + player.height) {
        ball.dx *= -1;
    }

    if (ball.x + ball.radius > computer.x &&
        ball.y > computer.y &&
        ball.y < computer.y + computer.height) {
        ball.dx *= -1;
    }

    // Score points
    if (ball.x + ball.radius > canvas.width) {
        playerScore++;
        resetBall();
    } else if (ball.x - ball.radius < 0) {
        computerScore++;
        resetBall();
    }
}

function resetBall() {
    ball.x = canvas.width / 2;
    ball.y = canvas.height / 2;
    ball.dx = ball.speed * (Math.random() > 0.5 ? 1 : -1);
    ball.dy = ball.speed * (Math.random() > 0.5 ? 1 : -1);
}

// Reset score function
function resetScore() {
    playerScore = 0;
    computerScore = 0;
    // Reset ball position
    resetBall();
    // Update score display immediately
    document.getElementById('playerScore').textContent = playerScore;
    document.getElementById('computerScore').textContent = computerScore;
}

function draw() {
    // Clear canvas
    ctx.fillStyle = 'rgba(0, 0, 0, 0.95)';
    ctx.fillRect(0, 0, canvas.width, canvas.height);

    // Draw paddles
    ctx.fillStyle = '#ffffff';
    ctx.fillRect(player.x, player.y, player.width, player.height);
    ctx.fillRect(computer.x, computer.y, computer.width, computer.height);

    // Draw ball with image and border
    if (ballImage.complete && ballImage.naturalHeight !== 0) {
        ctx.save();
        ctx.beginPath();
        ctx.arc(ball.x, ball.y, ball.radius, 0, Math.PI * 2);
        ctx.closePath();
        ctx.clip();
        
        // Draw the image
        const size = ball.radius * 2;
        ctx.drawImage(ballImage, ball.x - ball.radius, ball.y - ball.radius, size, size);
        
        // Restore context for border
        ctx.restore();
        
        // Draw border
        ctx.beginPath();
        ctx.arc(ball.x, ball.y, ball.radius, 0, Math.PI * 2);
        ctx.strokeStyle = '#ffffff';
        ctx.lineWidth = 2;
        ctx.stroke();
        ctx.closePath();
    } else {
        // Fallback to a solid circle if image isn't loaded
        ctx.beginPath();
        ctx.arc(ball.x, ball.y, ball.radius, 0, Math.PI * 2);
        ctx.fillStyle = '#ffffff';
        ctx.fill();
        ctx.closePath();
    }

    // Draw center line
    ctx.setLineDash([5, 15]);
    ctx.beginPath();
    ctx.moveTo(canvas.width / 2, 0);
    ctx.lineTo(canvas.width / 2, canvas.height);
    ctx.strokeStyle = '#ffffff';
    ctx.stroke();
    ctx.setLineDash([]);

    // Update score display
    document.getElementById('playerScore').textContent = playerScore;
    document.getElementById('computerScore').textContent = computerScore;
}

function gameLoop() {
    movePaddles();
    moveBall();
    draw();
    requestAnimationFrame(gameLoop);
}

// Start the game
gameLoop(); 