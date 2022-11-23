SET QUOTED_IDENTIFIER, ANSI_NULLS ON
GO

CREATE PROCEDURE [dbo].[GetLastVendorNumByProdId]    ---  GetLastVendorNumByProdId 3
@ProdID int
As 
Begin
declare @varno int
 
 SET NOCOUNT ON;
 if  exists (select * From tblVendor where ProdID =@ProdID)

 begin
 set @varno=(select Max(VendorID)+1 From tblVendor where ProdID =@ProdID)
 End 
 else 
 begin
 set @varno='1'
 end

 select @varno as VendorNo,@varno as VendorNo1;
 
END




GO