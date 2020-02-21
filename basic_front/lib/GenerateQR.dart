import 'dart:async';

import 'package:basic_front/REST/LoginCalls.dart';
import 'package:flutter/material.dart';
import 'package:fluttertoast/fluttertoast.dart';
import 'package:qr_flutter/qr_flutter.dart';

import 'Bus_Driver/BusDriver_ActiveDashboard.dart';
import 'Storage.dart';
import 'Structs/Volunteer.dart';
import 'Volunteer/Volunteer_ActiveDashboard.dart';
import 'Volunteer_Captain/VolunteerCaptain_ActiveDashboard.dart';

class QRPage extends StatefulWidget {
  QRPage({Key key, this.token}) : super(key: key);

  final String token;

  @override
  QRState createState() => QRState();
}

class QRState extends State<QRPage>
{
  Timer timer;
  Storage storage;

  Future<void> checkStatus()
  async {
    Volunteer volunteer = await RetrieveUser(widget.token, context);
    setState(() {
      Fluttertoast.showToast(
          msg: 'Is Checked In?: ${volunteer.checkedIn}',
          toastLength: Toast.LENGTH_SHORT,
          gravity: ToastGravity.CENTER,
          timeInSecForIos: 1,
          backgroundColor: Colors.green,
          textColor: Colors.white,
          fontSize: 16.0
      );

      if (volunteer.checkedIn)
      {
        if (volunteer.profile.role == "Bus Driver")
          Navigator.pushReplacement(context, MaterialPageRoute(builder: (context) => BusDriver_ActiveDashboard_Page(profile: volunteer.profile,)));
        else if (volunteer.profile.role == "Volunteer Captain")
          Navigator.pushReplacement(context, MaterialPageRoute(builder: (context) => VolunteerCaptain_ActiveDashboard_Page(profile: volunteer.profile,)));
        else
          Navigator.pushReplacement(context, MaterialPageRoute(builder: (context) => Volunteer_ActiveDashboard_Page(profile: volunteer.profile,)));
      }
    });
  }

  @override
  void initState() {
    super.initState();
    storage = new Storage();
    timer = Timer.periodic(Duration(seconds: 7), (Timer t) => checkStatus());
  }


  @override
  void dispose() {
    timer?.cancel();
    super.dispose();
  }

  @override
  Widget build (BuildContext context) {
    return LayoutBuilder(
      builder: (BuildContext context, BoxConstraints viewportConstraints) {
        return Scaffold (
          appBar: new AppBar(
            title: new Text("QR Code"),
          ),
          body: SingleChildScrollView(
            child: ConstrainedBox(
              constraints: BoxConstraints(
                minHeight: 200,
              ),
              child: Center (
                child: Column(
                  mainAxisAlignment: MainAxisAlignment.center,
                  crossAxisAlignment: CrossAxisAlignment.center,
                  children: <Widget>[
                    FutureBuilder(
                        future: storage.readToken(),
                        builder: (BuildContext context, AsyncSnapshot<String> snapshot) {
                          switch (snapshot.connectionState) {
                            case ConnectionState.none:
                              return new Text('Issue Posting Data');
                            case ConnectionState.waiting:
                              return new Center(child: new CircularProgressIndicator());
                            case ConnectionState.active:
                              return new Text('');
                            case ConnectionState.done:
                              if (snapshot.hasError) {
                                return Text("Error");
                              } else {
                                return QrImage(
                                  data: snapshot.data,
                                  version: QrVersions.auto,
                                  size: 320,
                                  errorStateBuilder: (cxt, err) {
                                    return Container(
                                      child: Center(
                                        child: Text(
                                          "Uh oh! Something went wrong...",
                                          textAlign: TextAlign.center,
                                        ),
                                      ),
                                    );
                                  },
                                );
                              }
                              break;
                            default:
                              return null;
                          }
                        }
                    ),
                  ],
                ),
              )
            ),
          ),
        );
      },
    );
  }
}