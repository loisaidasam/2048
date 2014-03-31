# Play 2048!
#
# where <command> is up|down|left|right|restart (or u|d|l|r for short):
#
# 2048 <command>
# <command>

module.exports = (robot) ->

  callApi = (name, cmd) ->
    robot.http("http://multiplayer-2048.herokuapp.com/api?sender=" + name + "&command=" + cmd)
      .get() (err, res, body) ->
        robot.logger.info name + ": " + cmd + "(" + body + ")"

  robot.hear /^2048 (\S+)$/i, (msg) ->
    name = msg.message.user.name
    cmd = msg.match[1]
    callApi name, cmd

  robot.hear /^(u|up)$/i, (msg) ->
    name = msg.message.user.name
    cmd = "up"
    callApi name, cmd

  robot.hear /^(r|right)$/i, (msg) ->
    name = msg.message.user.name
    cmd = "right"
    callApi name, cmd

  robot.hear /^(d|down)$/i, (msg) ->
    name = msg.message.user.name
    cmd = "down"
    callApi name, cmd

  robot.hear /^(l|left)$/i, (msg) ->
    name = msg.message.user.name
    cmd = "left"
    callApi name, cmd

  robot.hear /^(restart)$/i, (msg) ->
    name = msg.message.user.name
    cmd = "restart"
    callApi name, cmd
