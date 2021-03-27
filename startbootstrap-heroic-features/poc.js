function getData(){
    cardtext = " "
    cardtext += `<p>HTML stands for HyperText Markup Language. HTML is the standard markup language for describing the structure of web pages. <a href="https://www.tutorialrepublic.com/html-tutorial/" target="_blank">Learn more.</a></p>`;
    return document.getElementById('cardone')
      .innerHTML = cardtext;
}