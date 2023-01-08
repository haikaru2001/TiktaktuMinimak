let board = new TicTacToeBoard()
let turn = 'x'
let players = { x: 'human', o: 'human' }
let AIConfig = { x: { maxDepth: 10 }, o: { maxDepth: 10 } }
let state = null
let turnHistory = []

// on page ready
document.addEventListener("DOMContentLoaded", () => $('table').css('display', 'none'))
document.addEventListener("DOMContentLoaded", () => $('#level').css('display', 'none'))

function main()
{
    if ($('#btn').html() == 'Reset Game') 
    {
        turn = 'x'
        board = new TicTacToeBoard()
        turnHistory = []
        state = null
        $('#result').html('')
        $('table').css('display', 'none')
        $('#btn').html('Play Game')
        return
    }

    $('table').css('display', 'table')
    $('#btn').html('Reset Game')
    nextTurn()
    console.log(level)
}

function showlevel(){
    players.x = $('#p1').val();
    players.o = $('#p2').val();
    
    if (players.x == "ai" && players.o == "ai"){
        $('#level').css('display', 'none');
    }
    else if (players.x == "ai" || players.o == "ai"){
        $('#level').css(
            'display', 'table',
            'align-item', 'center'
            );
        
    }
    else
        $('#level').css('display', 'none');
}

// event listener
$('#btn').on('click', () => main())
$('#p1').on('change', () => showlevel())
$('#p2').on('change', () => showlevel())
$('#level').on('change', () => level = $('#level').val() )

function nextTurn()
{
    console.clear()
    board.printBoardPretty()
    renderBoard()

    // check win
    let win = board.getWinner()
    if (win != null)
    {
        if (win == 'tie') { 
            let msg = 'GAME DRAW!'
            state = 'tie';
            $('#result').html(msg);
            console.warn(msg)
        } else {
            let msg = 'PLAYER ' + win + ' WIN!!!'
            state = 'win'
            $('#result').html(msg)
            console.warn(msg)
        }
        return console.log({ gameResult: state, history: turnHistory, players, firstTurn: turnHistory[0], AIConfig, board })
    }

    // make message
    let gameText = "Player [" + turn +"] " + players[turn].toUpperCase() + " turn..."
    console.warn(gameText)
    $('#result').html(gameText)
    
    // nex turn
    if (players[turn] == 'ai') 
    {
        console.log("AI thinking...")
        setTimeout(() => AIMove(), 500)
    } else {
        console.log("[+] How To Human Turn with Console : [+]")
        console.log("    * User 'HumanMove(index) function")
        console.log("    * Example 'HumanMove(1) => For Move To 1x0 in Board")
    }
}

function AIMove()
{
    var levelselect = document.getElementById("level");
    var level = levelselect.value
    //console.log("easy diff")
    if(level == "easy"){
        let AI = new TicTacToeAI(turn, board)
        //AI.maxDepth = AIConfig[turn].maxDepth
        let result = AI.getRandomMove()
        turnHistory.push({ player: turn, move: result })
        board.move(turn, result.move)
        turn = (turn == 'x') ? 'o' : 'x'
      
        setTimeout(() => nextTurn(), 1)
        
        return ''
    }
    else if(level == "med"){

    }
    else{   
        let AI = new TicTacToeAI(turn, board)
        AI.maxDepth = AIConfig[turn].maxDepth
        let result = AI.getBestMove()
        turnHistory.push({ player: turn, move: result })
        board.move(turn, result.move)
        turn = (turn == 'x') ? 'o' : 'x'

        setTimeout(() => nextTurn(), 1)
        
        return ''
    }
}


function HumanMove(index)
{
    // if state not playing, block this function
    if (state != null || players[turn] != 'human') return 

    // turn
    board.move(turn, index)
    turn = (turn == 'x') ? 'o' : 'x'
    nextTurn()
    return ''
}

function renderBoard()
{
    for (let i = 0; i < 9; i++)
    {
        $('#cell' + i).html(board.state[i])
    }
}

for (let i = 0; i < 9; i++)
{
    $('#cell' + i).on('click', (e) => HumanMove($(e.target).attr('id').split('cell')[1]))
}