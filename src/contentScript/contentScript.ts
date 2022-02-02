const rules: {
  [url: string]: () => void
} = {
  'https://gamecopyworld.com/games/index.php': filterGameCopyWorld,
}

function filterNYTTechnology() {
  const app = document.getElementById('site-content')
  const wrapper = document.getElementById('top-wrapper')
  app.removeChild(wrapper)
}

function filterGameCopyWorld() {
  const divs = document.getElementsByTagName('div')
  for (const div of divs) {
    if (div.className == 'chk') {
      div.style.display = 'none'
    }
  }
}

if (document.URL in rules) {
  console.log(document.URL)
  rules[document.URL]()
}
