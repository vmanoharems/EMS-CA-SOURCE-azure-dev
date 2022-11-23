SET QUOTED_IDENTIFIER, ANSI_NULLS ON
GO
CREATE PROCEDURE  [dbo].[ReportsPayrollFilterJSON]
 @JSONparameters nvarchar(max)
 
AS
BEGIN

 SET NOCOUNT ON;
 -- declare @JSONparameters nvarchar(max)='{"PayrollEditFilterCompany":["1"],"PayrollEditFilterLocation":null,"PayrollEditFilterSet":null,"InvoiceNo":"EMSDVRCUN0018","hdnInvoice":"EMSDVRCUN0018","From":"","To":"","PayrollEdit":"{\"ProdId\":\"14\",\"Filter\":\"1|||EMSDVRCUN0018\",\"ProName\":\"EMS-Feature\",\"Mode\":1}","ProdId":"14","UserId":"59"}';
   declare @ProdId int= isnull(JSON_value(@JSONparameters,'$.ProdId'),-1);
declare @CID varchar(50)=Replace(Replace(Replace(isnull(JSON_query(@JSONparameters,'$.PayrollEditFilterCompany'),''),'[',''),']',''),'"','');
declare @Date1 date= isnull(json_value(@JSONparameters,'$.VendorCreatedFrom'),'1900-01-01');
declare @Date2 date= isnull(JSON_value(@JSONparameters,'$.VendorCreatedTo'),getdate());
declare @InvoiceNo varchar(50)= isnull(JSON_value(@JSONparameters,'$.InvoiceNo'),'');
declare @PayrollEdit nvarchar(500)=isnull(JSON_value(@JSONparameters,'$.PayrollEdit'),'');
declare @Mode int=isnull(JSON_value(@PayrollEdit,'$.Mode'),0);
declare @Location nvarchar(100)=Replace(Replace(Replace(isnull(JSON_query(@JSONparameters,'$.PayrollEditFilterLocation'),''),'[',''),']',''),'"','');
declare @Set nvarchar(100)=Replace(Replace(Replace(isnull(JSON_query(@JSONparameters,'$.PayrollEditFilterSet'),''),'[',''),']',''),'"','');

 if(@Date1='')
	 begin
	 set @Date1='0001-01-01'
	 end

	  if(@Date2='')
	 begin
	 set @Date2='9999-01-01'
	 end


   if(@Mode=1)
   begin
	select I.PayrollFileID,i.LoadNumber from PayrollFile I	
	where I.ProdID=@prodId 
	and (i.InvoiceNumber=@InvoiceNo  OR @InvoiceNo = '') and i.StartDate between @Date1 and @Date2 
	and (i.CompanyID=@CID  OR @CID = '')  and I.Status='Load'
	 order by i.PayrollFileID   


	 end
	 else
	 begin
	 select I.PayrollFileID,i.LoadNumber from PayrollFile I	
	where I.ProdID=@prodId 
	and (i.InvoiceNumber=@InvoiceNo  OR @InvoiceNo = '') and i.StartDate between @Date1 and @Date2 
	and (i.CompanyID=@CID  OR @CID = '')  and I.Status='Post'
	 order by i.PayrollFileID  
	 end
 
END
GO