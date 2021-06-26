document.addEventListener('DOMContentLoaded', () => {
    
    const userGrid = document.querySelector('.grid-user');
    const computerGrid = document.querySelector('.grid-computer');
    const displayGrid = document.querySelector('.grid-display');
    const ships = document.querySelectorAll('.ship');
    const destroyerContainer = document.querySelector('.destroyer-container');
    const submarineContainer = document.querySelector('.submarine-container');
    const cruiserContainer = document.querySelector('.cruiser-container');
    const battleshipContainer = document.querySelector('.battleship-container');
    const carrierContainer = document.querySelector('.carrier-container');

    const startBtn = document.getElementById('start');
    const rotateBtn = document.getElementById('rotate');
    const turnDisplay = document.getElementById('whose-go');
    const infoDisplay = document.getElementById('info');
    const setupButtons = document.getElementById('setup-buttons');

    const GRID_WIDTH = 10;
    const userSquares = [];
    const computerSquares = [];

    let isHorizontal = true;
    let isGameOver = false;
    let isPlayersTurn = true;

    let selectedShipNameWithIndex;
    let draggedShip;
    let draggedShipLength;

    let destroyerCount = 0;
    let submarineCount = 0;
    let cruiserCount = 0;
    let battleshipCount = 0;
    let carrierCount = 0;

    let cpuDestroyerCount = 0;
    let cpuSubmarineCount = 0;
    let cpuCruiserCount = 0;
    let cpuBattleshipCount = 0;
    let cpuCarrierCount = 0;

    const shipArray = [
        {
          name: 'destroyer',
          directions: [
            [0, 1],
            [0, GRID_WIDTH]
          ]
        },
        {
          name: 'submarine',
          directions: [
            [0, 1, 2],
            [0, GRID_WIDTH, GRID_WIDTH*2]
          ]
        },
        {
          name: 'cruiser',
          directions: [
            [0, 1, 2],
            [0, GRID_WIDTH, GRID_WIDTH*2]
          ]
        },
        {
          name: 'battleship',
          directions: [
            [0, 1, 2, 3],
            [0, GRID_WIDTH, GRID_WIDTH*2, GRID_WIDTH*3]
          ]
        },
        {
          name: 'carrier',
          directions: [
            [0, 1, 2, 3, 4],
            [0, GRID_WIDTH, GRID_WIDTH*2, GRID_WIDTH*3, GRID_WIDTH*4]
          ]
        },
    ]

    const checkForWins = () => {

        if (destroyerCount === 2) {
          infoDisplay.innerHTML = `You sunk the the enemy's destroyer`
          destroyerCount = 10
        }
        if (submarineCount === 3) {
          infoDisplay.innerHTML = `You sunk the the enemy's submarine`
          submarineCount = 10
        }
        if (cruiserCount === 3) {
          infoDisplay.innerHTML = `You sunk the the enemy's cruiser`
          cruiserCount = 10
        }
        if (battleshipCount === 4) {
          infoDisplay.innerHTML = `You sunk the the enemy's battleship`
          battleshipCount = 10
        }
        if (carrierCount === 5) {
          infoDisplay.innerHTML = `You sunk the the enemy's carrier`
          carrierCount = 10
        }
        if (cpuDestroyerCount === 2) {
          infoDisplay.innerHTML = `The enemy sunk your destroyer`
          cpuDestroyerCount = 10
        }
        if (cpuSubmarineCount === 3) {
          infoDisplay.innerHTML = `The enemy sunk your submarine`
          cpuSubmarineCount = 10
        }
        if (cpuCruiserCount === 3) {
          infoDisplay.innerHTML = `The enemy sunk your cruiser`
          cpuCruiserCount = 10
        }
        if (cpuBattleshipCount === 4) {
          infoDisplay.innerHTML = `The enemy sunk your battleship`
          cpuBattleshipCount = 10
        }
        if (cpuCarrierCount === 5) {
          infoDisplay.innerHTML = `The enemy sunk your carrier`
          cpuCarrierCount = 10
        }
    
        if ((destroyerCount + submarineCount + cruiserCount + battleshipCount + carrierCount) === 50) {
          infoDisplay.innerHTML = "YOU WIN"
          gameOver()
        }
        if ((cpuDestroyerCount + cpuSubmarineCount + cpuCruiserCount + cpuBattleshipCount + cpuCarrierCount) === 50) {
          infoDisplay.innerHTML = `ENEMY WINS`
          gameOver()
        }
    }

    const computerGo = () => {
        let random = Math.floor(Math.random() * userSquares.length);
        if (!userSquares[random].classList.contains('boom')) {
            const hit = userSquares[random].classList.contains('taken');
            userSquares[random].classList.add(hit ? 'boom' : 'miss')
            if (userSquares[random].classList.contains('destroyer')) cpuDestroyerCount++;
            if (userSquares[random].classList.contains('submarine')) cpuSubmarineCount++;
            if (userSquares[random].classList.contains('cruiser')) cpuCruiserCount++;
            if (userSquares[random].classList.contains('battleship')) cpuBattleshipCount++;
            if (userSquares[random].classList.contains('carrier')) cpuCarrierCount++;
            checkForWins();
        } else computerGo();

        isPlayersTurn = !isPlayersTurn;
        displayTurn(isPlayersTurn);
    }

    const createBoard = (grid, squares, width) => {
        for (let i = 0; i < width*width; i++) {
            const square = document.createElement('div')
            square.dataset.id = i
            grid.appendChild(square)
            squares.push(square)
          }
    }

    const displayTurn = (isPlayersTurn) => {
      if (isPlayersTurn) {
        turnDisplay.innerHTML = 'Your Go';
      } else {
        turnDisplay.innerHTML = 'Computers Go';
      }
    }
    const gameOver = () => {
      isGameOver = true
      setupButtons.style.display = 'block';
    }

    const generate = (ship) => {
        let randomDirection = Math.floor(Math.random() * ship.directions.length)
        let current = ship.directions[randomDirection]
        if (randomDirection === 0) direction = 1
        if (randomDirection === 1) direction = 10
        let randomStart = Math.abs(Math.floor(Math.random() * computerSquares.length - (ship.directions[0].length * direction)))
    
        const isTaken = current.some(index => computerSquares[randomStart + index].classList.contains('taken'))
        const isAtRightEdge = current.some(index => (randomStart + index) % GRID_WIDTH === GRID_WIDTH - 1)
        const isAtLeftEdge = current.some(index => (randomStart + index) % GRID_WIDTH === 0)
    
        if (!isTaken && !isAtRightEdge && !isAtLeftEdge) current.forEach(index => computerSquares[randomStart + index].classList.add('taken', ship.name))
    
        else generate(ship)
    }
      
    const playGame = () => {
        if (isGameOver) return;

        displayTurn(isPlayersTurn);

        if (isPlayersTurn) {
            computerSquares.forEach(square => square.addEventListener('click', function(e) {
                shotFired = square.dataset.id
                userGo(square);
            }))
        } else {
          setTimeout(computerGo(), 1000);
        }
    }

    
    const rotate = () => {
        destroyerContainer.classList.toggle('destroyer-container-vertical')
        submarineContainer.classList.toggle('submarine-container-vertical')
        cruiserContainer.classList.toggle('cruiser-container-vertical')
        battleshipContainer.classList.toggle('battleship-container-vertical')
        carrierContainer.classList.toggle('carrier-container-vertical')
        isHorizontal = !isHorizontal;      
    }
    
    const userGo = (square) => {
      if (square.classList.contains('miss') || square.classList.contains('boom')) { 
        return
      }

      if (square.classList.contains('destroyer')) destroyerCount++;
      if (square.classList.contains('submarine')) submarineCount++;
      if (square.classList.contains('cruiser')) cruiserCount++;
      if (square.classList.contains('battleship')) battleshipCount++;
      if (square.classList.contains('carrier')) carrierCount++;
      checkForWins();
 
      if (square.classList.contains('taken')) {
          square.classList.add('boom')
      } else {
          square.classList.add('miss')
      }

      isPlayersTurn = !isPlayersTurn;
      console.log('isPlayersTurn', isPlayersTurn)
      playGame();
    }

    rotateBtn.addEventListener('click', () => rotate());
    startBtn.addEventListener('click', () => {

      generate(shipArray[0]);
      generate(shipArray[1]);
      generate(shipArray[2]);
      generate(shipArray[3]);
      generate(shipArray[4]);

      setupButtons.classList.toggle('hidden');
      turnDisplay.classList.toggle('hidden');

      playGame();
    });
    
    createBoard(userGrid, userSquares, GRID_WIDTH);
    createBoard(computerGrid, computerSquares, GRID_WIDTH);

    ships.forEach(ship => ship.addEventListener('dragstart', dragStart))
    userSquares.forEach(square => square.addEventListener('dragstart', dragStart))
    userSquares.forEach(square => square.addEventListener('dragover', dragOver))
    userSquares.forEach(square => square.addEventListener('dragenter', dragEnter))
    userSquares.forEach(square => square.addEventListener('drop', dragDrop))
  
    ships.forEach(ship => ship.addEventListener('mousedown', (e) => {
        selectedShipNameWithIndex = e.target.id;
    }))

    const getDirection = (shipPosition, shipLength) => {
      if (shipPosition === 0) return 'start';
      if (shipPosition === shipLength - 1) return 'end';
      
      return 'middle';
    }

    function dragStart() {
        draggedShip = this;
        draggedShipLength = this.childNodes.length;
    }
    
    function dragOver(e) {
        e.preventDefault();
    }
    
    function dragEnter(e) {
        e.preventDefault();
    }
    
    function dragDrop() {
        let shipNameWithLastId = draggedShip.lastElementChild.id;
        let shipClass = shipNameWithLastId.slice(0, -2);

        let lastShipIndex = parseInt(shipNameWithLastId.substr(-1));
        let shipLastId = lastShipIndex + parseInt(this.dataset.id);

        const notAllowedHorizontal = [100, 0,10,20,30,40,50,60,70,80,90,1,11,21,31,41,51,61,71,81,91,2,22,32,42,52,62,72,82,92,3,13,23,33,43,53,63,73,83,93]
        const notAllowedVertical = [99,98,97,96,95,94,93,92,91,90,89,88,87,86,85,84,83,82,81,80,79,78,77,76,75,74,73,72,71,70,69,68,67,66,65,64,62,61,60]

        let newNotAllowedHorizontal = notAllowedHorizontal.splice(0, 10 * lastShipIndex)
        let newNotAllowedVertical = notAllowedVertical.splice(0, 10 * lastShipIndex)

        selectedShipIndex = parseInt(selectedShipNameWithIndex.substr(-1));
        shipLastId = shipLastId - selectedShipIndex;

        if (userSquares[parseInt(this.dataset.id)].classList.contains('taken')) return;

        if (isHorizontal && !newNotAllowedHorizontal.includes(shipLastId)) {
            for (let i = 0; i < draggedShipLength; i++) {

              let directionClass = getDirection(i, draggedShipLength);

              userSquares[parseInt(this.dataset.id) - selectedShipIndex + i]
                  .classList.add('taken', 'horizontal', directionClass, shipClass);
            }
        } else if(!isHorizontal && !newNotAllowedVertical.includes(shipLastId)) {
            for (let i = 0; i < draggedShipLength; i++) {

              let directionClass = getDirection(i, draggedShipLength);

              userSquares[parseInt(this.dataset.id) - selectedShipIndex + GRID_WIDTH * i]
                  .classList.add('taken', 'vertical', directionClass, shipClass);
            }
        } else return;

        displayGrid.removeChild(draggedShip);
    }
})


