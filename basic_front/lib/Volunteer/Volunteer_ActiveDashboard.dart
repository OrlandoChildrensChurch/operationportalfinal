import 'package:basic_front/BuildPresets/AppBar.dart';
import 'package:flutter/material.dart';

class Volunteer_ActiveDashboard_Page extends StatefulWidget {
  Volunteer_ActiveDashboard_Page({Key key, this.title}) : super(key: key);


  final String title;

  @override
  Volunteer_ActiveDashboard_State createState() => Volunteer_ActiveDashboard_State();
}

class Volunteer_ActiveDashboard_State extends State<Volunteer_ActiveDashboard_Page> with SingleTickerProviderStateMixin
{

  final List<Tab> myTabs = <Tab>[
    Tab(text: 'Roster')
  ];

  TabController _tabController;

  @override
  void initState() {
    super.initState();
    _tabController = TabController(vsync: this, length: myTabs.length);
  }

  @override
  void dispose() {
    _tabController.dispose();
    super.dispose();
  }

  @override
  Widget build(BuildContext context) {
    return Scaffold(
      appBar: AppBar(
        title: Text(widget.title),
        actions: <Widget>[
          buildProfileButton(context),
          buildLogoutButton(context),
        ],
      ),
      resizeToAvoidBottomPadding: false,
    );
  }
}














