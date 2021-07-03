import React, {useEffect, useRef, useState} from 'react';
import './App.css';

const App = () => {
	const canvas = useRef(null);
	let ctx, timer, pendulum, Tperiod, x0 = 0, y0 = 0, x = 0, y = 0, time = 0, runGame = false, dt = 0.02;
	const [pendulumObj, setPendulumObj] = useState({
		len: 200,
		A: 50,
		attraction: 9.8,
	});
	const [message, setMessage] = useState('');

	const changeInput = (event) => {
		setPendulumObj({...pendulumObj, [event.target.name]: +event.target.value})
	}

	const getData = () => {
		runGame = !runGame
		Tperiod = 2 * Math.PI / Math.sqrt(pendulumObj.len / pendulumObj.attraction)
		if (runGame) {
			if (isFinite(pendulumObj.A) && isFinite(pendulumObj.len) && isFinite(pendulumObj.attraction)) {
				if (pendulumObj.A > pendulumObj.len) {
					setMessage('Амплитуда не может быть больше длины')
					runGame = false
				}
				if (runGame) {
					movePendulum()
				}
			} else {
				setMessage('Заполните поля')
				runGame = false
			}
		}
	}

	const drawCanvas = () => {
		ctx = canvas.current.getContext('2d')
		x0 = canvas.current.width / 2
		y0 = canvas.current.height / 2
		line(x0, y0 - pendulumObj.len, x0, y0, "#555");
		pendulum = {
			x: x0,
			y: y0,
			r: 10,

			draw: function () {
				let grad = ctx.createRadialGradient(this.x, this.y, this.r, this.x - 2, this.y - 4, 2);
				grad.addColorStop(0, '#333')
				grad.addColorStop(1, '#999')
				ctx.fillStyle = grad
				ctx.beginPath()
				ctx.arc(this.x, this.y, this.r, 0, Math.PI * 2, true);
				ctx.fill()
			}
		}
		pendulum.draw()
	}

	const movePendulum = () => {
		impulsePendulum();
		timer = requestAnimationFrame(movePendulum)
	}

	const impulsePendulum = () => {
		ctx.clearRect(0, 0, canvas.current.width, canvas.current.height);
		time = time + dt
		x = pendulumObj.A * Math.sin(time / Tperiod * 2 * Math.PI) * Math.pow(2.71, -0.1 * time)
		y = Math.sqrt(pendulumObj.len * pendulumObj.len - x * x) - pendulumObj.len
		line(x0, y0 - pendulumObj.len, x + x0, y + y0, "#555");
		pendulum.x = x + x0;
		pendulum.y = y + y0;
		pendulum.draw();
	}

	const line = (x0, y0, x, y, color) => {
		ctx.beginPath();
		ctx.strokeStyle = color;
		ctx.moveTo(x0, y0);
		ctx.lineTo(x, y);
		ctx.closePath();
		ctx.stroke();
	}

	useEffect(() => {
		drawCanvas()
	}, [drawCanvas]);

	return (
		<>
			<canvas ref={canvas} style={{width: '500px', height: '250px'}}/>
			<label htmlFor="len">
				Длина: {pendulumObj.len} <br/>
				<input
					id='len'
					type="range"
					name='len'
					max='500'
					min='30'
					value={pendulumObj.len}
					onChange={changeInput}
				/>
			</label> <br/>
			<label htmlFor="A">
				Амплитуда: {pendulumObj.A} <br/>
				<input
					id='A'
					type="range"
					name='A'
					min={'1'}
					max={'100'}
					value={pendulumObj.A}
					onChange={changeInput}
				/>
			</label> <br/>
			<label htmlFor="attraction">
				Притяжение: {pendulumObj.attraction} <br/>
				<input
					id='attraction'
					type="range"
					min='1'
					max='100'
					step='1'
					name='attraction'
					value={pendulumObj.attraction}
					onChange={changeInput}
				/>
			</label> <br/>

			<button onClick={() => {
				getData()
			}}>Начать</button> <br/>
			<button onClick={() => {
				cancelAnimationFrame(timer)
				getData()
			}}>Остановить</button>
			{!message ? null :
				<p>{message}</p>
			}
		</>
	);
}

export default App;