
{
  "targets": [
    {
      "target_name": "rc522Uno",
      "sources": [
        "src/rc522.c",
        "src/rfid.c",
        "src/accessorUno.cc"
      ],
      "libraries": [
        "-lbcm2835"
      ]
    },
    {
      "target_name": "rc522Due",
      "sources": [
        "src/rc522.c",
        "src/rfid.c",
        "src/accessorDue.cc"
      ],
      "libraries": [
        "-lbcm2835"
      ]
    }    
  ]
}