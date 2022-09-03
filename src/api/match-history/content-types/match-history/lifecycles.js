let originalEloPlayerOne;
let originalEloPlayerTwo;
module.exports = {
  async beforeCreate(event) {
    const { data } = event.params;
    const idPlayerOne = data.player_one;
    const idPlayerTwo = data.player_two;
    try {
      const playerOne = await getPlayerData(idPlayerOne);
      const playerTwo = await getPlayerData(idPlayerTwo);

      originalEloPlayerOne = playerOne.elo;
      originalEloPlayerTwo = playerTwo.elo;

      data.old_elo_player_one = playerOne.elo;
      data.old_elo_player_two = playerTwo.elo;

      playerOne.elo += data.gained_elo_player_one;
      playerTwo.elo += data.gained_elo_player_two;

      entryNewElo(idPlayerOne, playerOne);
      entryNewElo(idPlayerTwo, playerTwo);
    } catch (err) {
      throw new Error(err);
    }
  },
  async beforeUpdate(event) {
    const { data } = event.params;
    const idPlayerOne = data.player_one;
    const idPlayerTwo = data.player_two;
    try {
      const playerOne = await getPlayerData(idPlayerOne);
      const playerTwo = await getPlayerData(idPlayerTwo);

      playerOne.elo = originalEloPlayerOne + data.gained_elo_player_one;
      playerTwo.elo = originalEloPlayerTwo + data.gained_elo_player_two;

      console.log(playerOne, playerTwo);
      entryNewElo(idPlayerOne, playerOne);
      entryNewElo(idPlayerTwo, playerTwo);
    } catch (err) {
      throw new Error(err);
    }
  },
};
const getPlayerData = async (idPlayer) =>
  await strapi.db
    .query("api::player.player")
    .findOne({ where: { id: idPlayer } });

const entryNewElo = async (idPLayer, playerData) =>
  await strapi.db.query("api::player.player").update({
    where: { id: idPLayer },
    data: playerData,
  });
