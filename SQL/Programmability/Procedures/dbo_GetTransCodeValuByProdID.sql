SET QUOTED_IDENTIFIER, ANSI_NULLS ON
GO

CREATE PROCEDURE [dbo].[GetTransCodeValuByProdID]  -- GetTransCodeValuByProdID 3
@ProdID int
AS
BEGIN

	SET NOCOUNT ON;

declare @TEMP table ( TrCode varchar(20),TRDes varchar(100), Trstatus bit, VType varchar(10),Parent varchar(20) )

Declare @TCID int, @TRCODE varchar(20),@TRST bit ,@TCDESC varchar(100)
 Declare TRCusrsor cursor  For

select TransactionCodeID,TransCode,Status,isnull(Description,'-') as Des  from TransactionCode  where ProdID=@ProdID;
  OPEN TRCusrsor   
       FETCH NEXT FROM TRCusrsor INTO @TCID,@TRCODE,@TRST,@TCDESC

       WHILE @@FETCH_STATUS = 0   
       BEGIN  

	   Insert into @TEMP
	    Values (@TRCODE,@TCDESC,@TRST,'Code','');

	   	Insert into @TEMP 
	 select TransValue,isnull(Description,'-') as Des,Status,'Value',@TRCODE from TransactionValue  where TransactionCodeID=@TCID and ProdID=@ProdID;


       FETCH NEXT FROM TRCusrsor INTO @TCID,@TRCODE,@TRST,@TCDESC
       END   

CLOSE TRCusrsor   
DEALLOCATE TRCusrsor;	

select Parent, Trcode,TRDes,case when Trstatus=0 then 'Inactive' else 'Active' end as Trstatus,VType  from @TEMP


END



GO