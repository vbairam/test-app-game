import './App.css';
import React from 'react';
import { getWeatherById } from './utils';
import cityJson from './utils/city.list.json'
import { Button, Slider, Spin, Steps, Table, Tag } from 'antd';
import 'antd/dist/antd.min.css';
import { marks } from './utils/marks';


const { Step } = Steps;

function App() {
  const [cities, setCities] = React.useState([])
  const [currentCity, setCurrentCity] = React.useState(0)
  const [isLoading, setIsLoading] = React.useState(false)
  const [currentChoise, setCurrentChoise] = React.useState(0)
  const [result, setResult] = React.useState(null)
  const getWeather = async () => {
    setIsLoading(true)
    var tmp = []
    for (let i = 0; i < 5; i++) {
      var randId = Math.floor(0 + Math.random() * (cityJson.length + 1 - 0))
      const city = await getWeatherById(cityJson[randId].id)
      tmp.push({ id: randId, name: city.name, coord: city.coord, key: i, temp: city.main.temp, choise: null, choiseStatus: null })
    }
    setCities(tmp)
    setIsLoading(false)
  }

  const columns = [
    { title: 'Temperature', dataIndex: 'temp', render: (temp, record) => record.choise !== null ? <p>{temp}</p> : null },
    { title: 'Answer', dataIndex: 'choise', render: choise => <p>{choise}</p> },
    { dataIndex: 'choiseStatus', render: choiseStatus => choiseStatus !== null ? (choiseStatus ? <Tag color='green'>☑</Tag> : <Tag color='error'>x</Tag>) : null }
  ]

  React.useEffect(() => {
    if (!cities.length) {
      getWeather()
    }
  }, [cities, setCities])

  const saveChoise = (step) => {
    var tmp = cities
    tmp[currentCity].choise = currentChoise
    tmp[currentCity].choiseStatus = currentChoise - 3 <= tmp[currentCity].temp && tmp[currentCity].temp <= currentChoise + 3
    setCities(tmp)
    setCurrentChoise(0)
    setCurrentCity(currentCity + step)
  }

  const restart = () => {
    setCities([])
    setCurrentCity(0)
    setResult(null)
  }

  const submit = () => {
    saveChoise(0)
    var correctResults = 0
    for (let i = 0; i < cities.length; i++) {
      if (cities[i].choiseStatus) correctResults++
    }
    setResult(correctResults)
  }


  if (isLoading) {
    return <div className='spiner'><Spin size='large' spinning={isLoading} /></div>
  }
  else {
    return <div className='wrapper'>
      {cities.length && <>
        {result === null ? <>
          <Steps current={currentCity} className='stepper'>
            {cities.map((city) => {
              return <Step key={`step_${city.id}`} />
            })}
          </Steps>
          <h1 key={cities[currentCity].name}>{currentCity + 1}.{cities[currentCity].name}</h1>
          <iframe
            loading="lazy"
            title='City map'
            src={`https://www.google.com/maps/embed/v1/place?key=${process.env.REACT_APP_MAPS_KEY}&q=${cities[currentCity].coord.lat},${cities[currentCity].coord.lon}`}>
          </iframe>
          <Slider disabled={false} marks={marks} min={-50} max={50} value={cities[currentCity].choise || currentChoise} onChange={(value) => setCurrentChoise(value)}></Slider>
          {currentCity === cities.length - 1 ?
            <Button type="primary" onClick={submit} className='saveButton'>Submit</Button>
            :
            <Button type="primary" disabled={currentCity === cities.length - 1} className='saveButton' onClick={() => saveChoise(1)}>Next</Button>
          }</> : <>
          {result > 3 ? <>
            <h1>You win</h1>
          </> : <><h1>You lost 😢</h1>
            <h3>Try better next time😉</h3>
          </>}
          <h2>Total score: {result}</h2>
          <Button type="primary" className='saveButton' onClick={() => restart()}>Restart</Button>
        </>}
        <Table onHeaderRow={false} pagination={false} dataSource={cities} columns={columns} />
      </>
      }
    </div>
  }
}

export default App;
