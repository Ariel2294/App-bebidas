import React, { Component } from "react";
import {
  Platform,
  StyleSheet,
  Text,
  View,
  Image,
  Alert,
  Button
} from "react-native";
import moment from "moment";
import es from "moment/locale/es";
import axios from "axios";
import config from "./helpers/config";
import Select from "react-native-select-plus";
export default class App extends Component {
  // constructor(props) {
  //   super(props);
  //   this.state = {
  //     selectedItem: {},
  //     bebidas: this.getBebidas()
  //   };
  // }
  state = {
    value: null,
    codigo_bebida: null,
    items: [],
    nombre: "",
    apellido: "",
    id_user: ""
  };

  onSelectedItemsChange = (key, value) => {
    this.setState({ value: value, codigo_bebida: key });
  };

  componentDidMount() {
    const usuarios = {
      david: "5e37a79b7c213e47b9d2f856",
      deol: "5e38e1f27c213e47b9d37a3f",
      pancho: "5e38e21a7c213e47b9d37a40",
      ariel: "5e38e1ce7c213e47b9d37a3b"
    };

    this.setState({
      items: this.getBebidas()
    });
    this.getUser(usuarios.pancho);
  }

  guardar() {
    let fecha = this.fecha_completa(new Date());
    const data = {
      usuario: {
        nombre: this.state.nombre,
        apellido: this.state.apellido,
        _id: this.state.id_user
      },
      bebida: { _id: this.state.codigo_bebida, bebida: this.state.value },
      dia: fecha.dia,
      mes: fecha.mes,
      fecha: fecha.fecha_completa,
      year: fecha.year,
      hora: fecha.hora
    };
    if (this.state.codigo_bebida !== null && this.state.value !== null) {
      axios.post(config.api + "savebebidas", data).then(result => {
        if (result.status == 200) {
          alert("Se guardo esta mierda");
        }
      });
    } else {
      alert("Pendejo selecciona una bebida");
    }
  }
  getBebidas() {
    let data = [];
    axios.get(config.api + "bebidas").then(res => {
      res.data.ok.forEach(element => {
        data.push({ key: element._id, label: element.tipo });

        if (element.tipo === "Agua") {
          this.setState({
            value: { key: element._id, label: element.tipo }
          });
        }
      });
    });

    return data;
  }

  async getUser(id) {
    await axios.get(config.api + "user/" + id).then(res => {
      this.setState({
        nombre: res.data.usuario.nombre,
        apellido: res.data.usuario.apellido,
        id_user: res.data.usuario._id
      });
    });
  }

  fecha_completa(fecha) {
    let date = moment(fecha, "DD/MM/YYYY HH:mm:ss");

    return {
      fecha_completa: date.format("DD/MM/YYYY HH:mm:ss"),
      dia: date.format("dddd"),
      mes: date.format("MMMM"),
      year: date.format("YYYY"),
      hora: date.format("HH:mm:ss")
    };
  }
  render() {
    return (
      <View style={styles.container}>
        <Text style={styles.welcome}>Bienvenido</Text>
        <Text style={styles.instructions}>
          {this.state.nombre + " " + this.state.apellido}
        </Text>

        <Select
          data={this.state.items}
          width={350}
          placeholder="Seleccione una bebida"
          onSelect={this.onSelectedItemsChange.bind(this)}
          search={true}
        />

        <View style={{ marginTop: 30, width: 350 }}>
          <Button onPress={this.guardar.bind(this)} title="Guardar" />
        </View>
      </View>
    );
  }
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    marginTop: 60,
    justifyContent: "flex-start",
    alignItems: "center",
    backgroundColor: Platform.select({
      ios: "blue",
      android: "#fff"
    })
  },
  welcome: {
    fontSize: 20,
    textAlign: "center",
    margin: 10
  },
  instructions: {
    textAlign: "center",
    color: "#333333",
    marginBottom: 30
  }
});
