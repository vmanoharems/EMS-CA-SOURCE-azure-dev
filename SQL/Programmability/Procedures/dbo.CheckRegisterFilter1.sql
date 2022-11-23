SET QUOTED_IDENTIFIER, ANSI_NULLS ON
GO
-- =============================================
CREATE PROCEDURE [dbo].[CheckRegisterFilter1]    -- exec CheckRegisterFilter1 '01',54,'','',1,9999999,''
(
@CompanyID varchar(50),
@ProdID int,
@BankID varchar(50),
@VendorID varchar(50),
@CheckFrom int,
@CheckTo int,
@CheckType varchar(50)
)
AS
BEGIN
	-- SET NOCOUNT ON added to prevent extra result sets from
	-- interfering with SELECT statements.
	SET NOCOUNT ON;

	declare @CID int;
	select @CID=CompanyID from Company where CompanyCode=@CompanyID and ProdID=@ProdID;

	declare @CheckNumber1 int;
	declare @PaymentDate1 varchar(100);
	declare @PayBy1 varchar(100);
    declare @VendorName1 varchar(100);
    declare @CompanyID1 int
    declare @HeaderAmount1 decimal(18,2);
    declare @PaidAmount1 decimal(18,2);
    declare @BankId1 int;
    declare @Bankname1 varchar(100);
	declare @TransactionNumber1 varchar(100);
	declare @DocumentNo1 varchar(100);
	declare @Description1 varchar(100);
	declare @SS21 varchar(100);
	declare @AccountCode1 varchar(100);
	declare @Amount1 decimal(18,2);
	declare @TaxCode1 varchar(100);
	declare @SetCode1 varchar(100);
	declare @Transactionstring1 varchar(100);
	declare @TransactionvalueString1 varchar(100);
	declare @ReferenceNumber1 int;

	declare @CheckStatus int;
  	set @CheckStatus=0;

	declare @TransStatus int;
  	set @TransStatus=0;

Declare @Mtree TABLE (CheckNumber int,PaymentDate varchar(100),PayBy varchar(100),VendorName varchar(100),CompanyID int,
   HeaderAmount decimal(18,2),PaidAmount decimal(18,2),BankId int,Bankname varchar(100),TransactionNumber varchar(100),
	DocumentNo varchar(100),Description varchar(100),SS2 varchar(100),AccountCode varchar(100),Amount decimal(18,2),
	TaxCode varchar(100),SetCode varchar(100),Transactionstring varchar(100),TransactionvalueString varchar(100)
	,ReferenceNumber int
)

DECLARE Cus_Category CURSOR FOR 

	select a.CheckNumber,CONVERT(varchar(10),a.PaymentDate,101) as PaymentDate,a.PayBy,e.VendorName,c.CompanyID,
	 [dbo].[GetCheckAmount](a.CheckNumber,a.BankId) as  HeaderAmount,a.PaidAmount,a.BankId,f.Bankname,g.TransactionNumber
	 ,g.DocumentNo,g.Description,i.SS2,j.AccountCode,d.Amount,
	 d.TaxCode, isnull(k.AccountCode,'') as SetCode,d.Transactionstring,
	 dbo.convertcodes(d.Transactionstring)as TransactionvalueString,g.ReferenceNumber

	 from Payment as a inner join 
	 PaymentLine as b on a.PaymentId=b.PaymentId 
	 inner join Invoice as c on b.InvoiceId=c.Invoiceid
	 inner join InvoiceLine as d on c.Invoiceid=d.InvoiceID
	 inner join tblVendor as e on a.VendorId=e.VendorID
	 inner join BankInfo as f on a.BankId=f.BankId
	 inner join JournalEntry as g on a.PaymentId=g.ReferenceNumber and g.SourceTable='Payment'
	 inner join COA as i on d.COAId=i.COAID
	 inner join TblAccounts as j on i.AccountId=j.AccountId
	 left join TblAccounts as k on d.SetId=k.AccountId
	 
	where a.ProdID=@prodId and(a.BankId=@BankID  OR @BankID = '') and(c.CompanyID=@CID  OR @CompanyID = '')
	and (a.VendorID=@VendorID  OR @VendorID = '') and a.CheckNumber between @CheckFrom and @CheckTo 
	and (a.PayBy=@CheckType  OR @CheckType = '')
	 
   group by a.CheckNumber,a.PaymentDate,a.PayBy,e.VendorName,c.CompanyID,a.PaidAmount,a.BankId,f.Bankname,
   g.TransactionNumber,g.DocumentNo,g.Description	,i.SS2,j.AccountCode,d.Amount,d.TaxCode
   ,k.AccountCode,d.Transactionstring,g.ReferenceNumber,d.invoicelineid


open Cus_Category;
     fetch next from Cus_Category into @CheckNumber1,@PaymentDate1,@PayBy1,@VendorName1,@CompanyID1 ,
   @HeaderAmount1 ,@PaidAmount1 ,@BankId1 ,@Bankname1 ,@TransactionNumber1 ,@DocumentNo1 ,@Description1 ,
   @SS21 ,@AccountCode1 ,@Amount1 ,	@TaxCode1 ,@SetCode1 ,@Transactionstring1 ,@TransactionvalueString1 ,@ReferenceNumber1

     while @@FETCH_STATUS = 0
     begin

	     if(@CheckNumber1=@CheckStatus)
	     begin
		    if(@TransStatus!=@TransactionNumber1)
			begin
	        insert into @Mtree values(@CheckNumber1,@PaymentDate1,@PayBy1,@VendorName1,@CompanyID1 ,
   @HeaderAmount1 ,@PaidAmount1 ,@BankId1 ,@Bankname1 ,@TransactionNumber1 ,@DocumentNo1 ,@Description1 ,
   @SS21 ,@AccountCode1 ,@Amount1 ,	@TaxCode1 ,@SetCode1 ,@Transactionstring1 ,@TransactionvalueString1 ,@ReferenceNumber1);
	       END
	     end
	 else
	     begin

	     insert into @Mtree values(@CheckNumber1,@PaymentDate1,@PayBy1,@VendorName1,@CompanyID1 ,
   @HeaderAmount1 ,@PaidAmount1 ,@BankId1 ,@Bankname1 ,@TransactionNumber1 ,@DocumentNo1 ,@Description1 ,
   @SS21 ,@AccountCode1 ,@Amount1 ,	@TaxCode1 ,@SetCode1 ,@Transactionstring1 ,@TransactionvalueString1 ,@ReferenceNumber1);

	 end


	 set @CheckStatus=@CheckNumber1;
	 set @TransStatus=@TransactionNumber1;
	
 
        fetch next from Cus_Category into @CheckNumber1,@PaymentDate1,@PayBy1,@VendorName1,@CompanyID1 ,
   @HeaderAmount1 ,@PaidAmount1 ,@BankId1 ,@Bankname1 ,@TransactionNumber1 ,@DocumentNo1 ,@Description1 ,
   @SS21 ,@AccountCode1 ,@Amount1 ,	@TaxCode1 ,@SetCode1 ,@Transactionstring1 ,@TransactionvalueString1 ,@ReferenceNumber1
	 end
     CLOSE Cus_Category
     DEALLOCATE Cus_Category


	 select * from @Mtree
	 end
GO