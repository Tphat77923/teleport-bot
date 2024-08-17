const pb = {
    le: '<:LE:1274207822602698773>',
    me: '<:ME:1274207854974472202>',
    re: '<:RE:1274207883944525865>',
    lf: '<:LF:1274207839287644311>',
    mf: '<:MF:1274207868807155807>',
    rf: '<:RF:1274207897525551126>',
  };
  
  function formatResults(upvotes = [], downvotes = []) {
    const totalVotes = upvotes.length + downvotes.length;
    const progressBarLength = 14;
    const filledSquares = Math.round((upvotes.length / totalVotes) * progressBarLength) || 0;
    const emptySquares = progressBarLength - filledSquares || 0;
  
    if (!filledSquares && !emptySquares) {
      emptySquares = progressBarLength;
    }
  
    const upPercentage = (upvotes.length / totalVotes) * 100 || 0;
    const downPercentage = (downvotes.length / totalVotes) * 100 || 0;
  
    const progressBar =
      (filledSquares ? pb.lf : pb.le) +
      (pb.mf.repeat(filledSquares) + pb.me.repeat(emptySquares)) +
      (filledSquares === progressBarLength ? pb.rf : pb.re);
  
    const results = [];
    results.push(
      `👍 ${upvotes.length} upvotes (${upPercentage.toFixed(1)}%) • 👎 ${
        downvotes.length
      } downvotes (${downPercentage.toFixed(1)}%)`
    );
    results.push(progressBar);
  
    return results.join('\n');
  }
  
  module.exports = formatResults;